import "./modal.css";
import api from "../../../config/config.js";
import { useState } from "react";
import Loading from "../../loadingAnimation/Loading";

function SignInModal({ toggle1, toggle2 }) {
   const [isLoading, setIsLoading] = useState(false);

   async function checkSignIn(event) {
      event.preventDefault();
      let formData = new FormData();

      setIsLoading(false);

      let inputs = document.querySelectorAll("input[name]");

      inputs.forEach((input) => {
         formData.append(input.name, input.value);
      });

      document.body.style.cursor = "wait";

      try {
         const resonse = await fetch(`${api}/auth/login`, {
            body: formData,
            method: "post",
         });

         document.body.style.cursor = "default";
         if (!resonse.ok)
            return alert("Tên đăng nhập hoặc mật khẩu không đúng!");

         const data = await resonse.json();

         // socket.connect();

         localStorage.setItem("currentUser", data.token);
         window.location.reload();
      } catch (error) {
         console.log(error);
      }
   }

   return (
      <>
         {isLoading && <Loading />}

         <div
            className="modal-layer flex-center"
            onClick={() => {
               toggle1.handleSignIn();
            }}
         >
            <div
               className="sign-in--modal"
               onClick={(e) => {
                  e.stopPropagation();
               }}
            >
               <form action="#" method="POST" id="form-sign-in">
                  <div className="modal__header position-relative">
                     <div className="modal__content flex-center flex-direction-col">
                        <h3 className="modal--heading">Đăng nhập</h3>
                        <span className="modal--subheading">
                           Xin chào, chúc bạn một ngày tốt lành !
                        </span>
                     </div>

                     <div
                        className="modal__close--btn position-absolute "
                        onClick={(e) => {
                           toggle1.handleSignIn();
                           e.stopPropagation();
                        }}
                     >
                        <i className="fa-solid fa-xmark"></i>
                     </div>
                  </div>

                  <div className="modal__body flex-center flex-direction-col">
                     <div className="form-group">
                        <label htmlFor="username" className="form-label">
                           Mã cá nhân:
                        </label>
                        <input
                           id="username"
                           name="username"
                           type="text"
                           placeholder="Nhập mã cá nhân"
                           className="form-control"
                        />
                        <span className="form-message"></span>
                     </div>

                     <div className="form-group position-relative">
                        <label htmlFor="password" className="form-label">
                           Mật khẩu:
                        </label>
                        <input
                           id="password"
                           name="password"
                           type="password"
                           placeholder="Nhập mật khẩu"
                           className="form-control"
                        />
                        <span className="form-message"></span>
                        <span className="forget-password position-absolute">
                           Quên mật khẩu ?
                        </span>
                     </div>
                  </div>
                  <div className="modal__footer flex-center flex-direction-col">
                     <button
                        className="form-submit"
                        type="submit"
                        onClick={(e) => {
                           toggle1.handleSignIn();
                           checkSignIn(e);
                        }}
                     >
                        Đăng nhập
                     </button>

                     <div className="dont-have-account">
                        <span>Bạn chưa có tài khoản? </span>
                        <span
                           className="click-to-sign-up"
                           onClick={() => {
                              toggle2.handleSignUp();
                              toggle1.handleSignIn();
                           }}
                        >
                           Đăng ký ngay
                        </span>
                     </div>
                  </div>
               </form>
            </div>
         </div>
         <div className="notification-sign-in"></div>
      </>
   );
}

export default SignInModal;
