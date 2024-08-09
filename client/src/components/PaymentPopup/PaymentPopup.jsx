import React, { useRef, useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiChevronDoubleRight } from "@mdi/js";
import axios from "axios";
import "./PaymentPopup.scss";

function PaymentPopup({ amount, onClose, onPay, onFail, subId, memberId }) {
  const popupRef = useRef(null);
  const sliderRef = useRef(null);
  const [isSliding, setIsSliding] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  -+useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleMouseDown = (e) => {
    setIsSliding(true);
    const slider = sliderRef.current;
    const sliderRect = slider.getBoundingClientRect();
    setStartPosition(e.clientX - sliderRect.left);
  };

  const handleMouseMove = (e) => {
    if (isSliding) {
      const slider = sliderRef.current;
      const sliderRect = slider.getBoundingClientRect();
      let newPosition = e.clientX - sliderRect.left - startPosition;

      if (newPosition < 0) newPosition = 0;
      if (newPosition > sliderRect.width - 50)
        newPosition = sliderRect.width - 50;

      setSlidePosition(newPosition);
    }
  };

  const handleMouseUp = async () => {
    const slider = sliderRef.current;
    const sliderRect = slider.getBoundingClientRect();

    if (slidePosition >= sliderRect.width - 50) {
      try {
        await axios.post(`http://localhost:6969/make-payment/${memberId}`, {
          amount,
          subId,
        });
        onPay();
      } catch (error) {
        console.error("Payment failed:", error);
        onFail();
      }
    }

    setIsSliding(false);
    setSlidePosition(0);
  };

  useEffect(() => {
    if (isSliding) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSliding, slidePosition]);

  return (
    <div className="payment-popup-backdrop" data-aos="zoom-out">
      <div className="payment-popup" ref={popupRef}>
        <h3>Confirm Payment</h3>
        <p>Amount: ₹ {amount}</p>
        <div
          className="slide-to-pay"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
        >
          <div
            className="slide-progress"
            style={{ width: `${slidePosition + 50}px` }}
          >
            <div
              className="slider-icon"
              style={{ left: `${slidePosition + 13}px` }}
            >
              <Icon path={mdiChevronDoubleRight} size={1} color="#fff" />
            </div>
          </div>
          <span
            className={`slide-text ${
              slidePosition >= sliderRef.current?.clientWidth / 2
                ? "touched"
                : ""
            }`}
          >
            Slide to Pay
          </span>
        </div>
      </div>
    </div>
  );
}

export default PaymentPopup;
