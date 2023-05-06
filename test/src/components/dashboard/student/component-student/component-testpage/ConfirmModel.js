import { useNavigate } from "react-router";
import api from "../../../../../config/config";

function ConfirmModel({ setIsOpen, isOpen, result, handleSubmit }) {
   const navigator = useNavigate();
   const sendResult = () => {
      const answer = JSON.stringify(result);
      console.log(answer);
      fetch(`${api}/classes/a111/exams`, {
         body: answer,
         method: "POST",
      }).then(() => navigator("../"));
   };

   return (
      <div className="modal flex-center" onClick={() => setIsOpen(!isOpen)}>
         <div
            className="main-form"
            onClick={(e) => e.stopPropagation()}
            // style={{ display: "none" }}
         >
            <div className="header-form">
               <div
                  id="close"
                  className="flex-center"
                  onClick={() => setIsOpen(!isOpen)}
               >
                  <i
                     className="fa-solid fa-xmark"
                     style={{ color: "#888888" }}
                  ></i>
               </div>
            </div>
            <div className="content-form flex-center">
               Bạn chắc chắn muốn nộp bài?
               <br />
               <br />
               Chúng tôi khuyến khích bạn kiểm tra lại bài làm 1 lần nữa.
            </div>
            <div className="footer-form">
               <button
                  className="confirm-btn form-btn"
                  form="answerform"
                  onClick={() => {}}
               >
                  Xác nhận nộp
               </button>
               <button
                  className="cancel-btn form-btn"
                  onClick={() => {
                     setIsOpen(!isOpen);
                  }}
               >
                  Quay lại
               </button>
            </div>
         </div>

         <div className="time-out-form" onClick={(e) => e.stopPropagation()}>
            <div
               className="header-form flex-center"
               style={{ paddingTop: "5px" }}
            >
               <h2
                  className="flex-center"
                  style={{
                     width: "100%",
                     fontWeight: "600",
                     color: "#333",
                     fontSize: "1.7rem",
                  }}
               >
                  Thông báo !
               </h2>
            </div>
            <div className="content-form flex-center">
               Đã hết thời gian làm bài.
               <br />
               <br />
               Bài làm đã được nộp theo cơ chế mặc định.
            </div>
            <div className="footer-form">
               <button
                  className="confirm-btn form-btn"
                  onClick={() => {
                     setIsOpen(!isOpen);
                  }}
               >
                  Đã hiểu
               </button>
            </div>
         </div>
      </div>
   );
}

export default ConfirmModel;
