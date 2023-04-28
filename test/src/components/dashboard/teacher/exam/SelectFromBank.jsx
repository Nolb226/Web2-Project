import { useState, useEffect } from "react";
import api from "../../../../config/config";
import handleType1 from "./HandleType1";
import handleType2_3 from "./HandleType2_3";
import responsiveCreateExam from "./responsiveCreateExam";
import Loading from "../../../loadingAnimation/Loading";
import LoadingData from "../../../loadingAnimation/LoadingData";

const selectFromBankLayout = {
   width: "100%",
   height: "100%",
   marginTop: "1px",
   padding: "2%",
   backgroundColor: "#fff",
   position: "absolute",
   right: "0",
   left: "0",
   alignItems: "flex-start",
   boxSizing: "border-box",
};

const inputList = {
   padding: "10% 0px 0px 12px",
   width: "100%",
   height: "100%",
   minHeight: "450px",
   justifyContent: "flex-start",
};

const label = {
   color: "#444444",
   fontSize: "1.4rem",
   fontWeight: "600",
   width: "150px",
   lineHeight: "3rem",
};

const question = {
   width: "690px",
   height: "40px",
   border: "none",
   flex: "1",
   background: "#F0F0F0",
   padding: "0 10px",
   fontSize: "1.6rem",
   fontWeight: "600",
   lineHeight: "1.6rem",
   outline: "none",
   color: "#444",
   display: "flex",
   alignItems: "center",
   cursor: "default",
   overflow: "hidden",
};

const answer = {
   flex: "1",
   height: "32px",
   lineHeight: "1.5rem",
   border: "none",
   background: "#fff",
   padding: "0 10px",
   fontSize: "1.5rem",
   outline: "none",
   color: "#444",
   marginLeft: "15px",
   display: "flex",
   alignItems: "center",
};

function Question({ questionObject }) {
   useEffect(() => {
      const liElement = document.getElementById(`${questionObject.id}`);
      liElement.querySelectorAll("input[type=radio]").forEach((item) => {
         if (item.value === questionObject.correctAns) item.checked = true;
      });
   }, []);

   return (
      <li
         id={questionObject.id}
         className="question-box"
         style={{
            width: "100%",
            padding: "5px 0",
            borderBottom: "solid 1px #d5d5d5",
         }}
         // data-level={questionObject.level}
         // data-chapterId={questionObject.chapterId}
      >
         <div style={{ width: "100%" }}>
            <div className="flex-center" style={{ width: "100%" }}>
               <input
                  type="checkbox"
                  name=""
                  data-level={questionObject.level}
                  data-chapterid={questionObject.chapterId}
                  id={questionObject.id}
                  style={{
                     width: "18px",
                     height: "18px",
                     marginRight: "5px",
                  }}
               />
               <h1
                  name="question"
                  style={question}
                  placeholder="Câu hỏi"
                  title={questionObject.description}
               >
                  {questionObject.description}
               </h1>
            </div>

            <div
               className="flex-center flex-direction-col"
               style={{ marginTop: "15px", paddingLeft: "20px" }}
            >
               <div
                  className="flex-center"
                  style={{ width: "100%", height: "40px" }}
               >
                  <input
                     type="radio"
                     disabled="true"
                     name={questionObject.id + "correct"}
                     className={questionObject.id + "correct"}
                     value="A"
                     style={{
                        margin: "0",
                        width: "15px",
                        height: "15px",
                     }}
                  />
                  <p style={answer}>{questionObject.answerA}</p>
               </div>
               <div
                  className="flex-center"
                  style={{ width: "100%", height: "40px" }}
               >
                  <input
                     type="radio"
                     disabled="true"
                     name={questionObject.id + "correct"}
                     className={questionObject.id + "correct"}
                     value="B"
                     style={{
                        margin: "0",
                        width: "15px",
                        height: "15px",
                     }}
                  />
                  <p style={answer}>{questionObject.answerB}</p>
               </div>
               <div
                  className="flex-center"
                  style={{ width: "100%", height: "40px" }}
               >
                  <input
                     type="radio"
                     disabled="true"
                     name={questionObject.id + "correct"}
                     className={questionObject.id + "correct"}
                     value="C"
                     style={{
                        margin: "0",
                        width: "15px",
                        height: "15px",
                     }}
                  />
                  <p style={answer}>{questionObject.answerC}</p>
               </div>
               <div
                  className="flex-center"
                  style={{ width: "100%", height: "40px" }}
               >
                  <input
                     type="radio"
                     disabled="true"
                     name={questionObject.id + "correct"}
                     className={questionObject.id + "correct"}
                     value="D"
                     style={{
                        margin: "0",
                        width: "15px",
                        height: "15px",
                     }}
                  />
                  <p style={answer}>{questionObject.answerD}</p>
               </div>
            </div>
         </div>
      </li>
   );
}

const getParentElement = (childElement, parentSelector) => {
   while (childElement.parentElement) {
      if (childElement.parentElement.matches(parentSelector)) {
         return childElement.parentElement;
      }
      childElement = childElement.parentElement;
   }
};

function clearErrorMessage(selector) {
   let parentElement = getParentElement(
      document.querySelector(selector),
      ".form-group"
   );

   document.querySelector(selector).innerText = "";
   parentElement.classList.remove("invalid");
}

function SelectFromBank() {
   responsiveCreateExam();
   const currentUser = localStorage.getItem("currentUser");

   const [examChapter, setExamChapter] = useState([]);
   const [examQuestions, setExamQuestions] = useState([]);
   const [chapters, setChapters] = useState([]);
   const [type, setType] = useState(1);
   const [questionArray, setQuestionArray] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoadingData, setIsLoadingData] = useState(false);

   const easyElement = document.getElementById("easy");
   const hardElement = document.getElementById("hard");
   const totalElement = document.getElementById("totalQuestions");

   // console.log(examQuestions);

   const increase = (level) => {
      totalElement.value = parseInt(totalElement.value) + 1;

      if (level == "0") easyElement.value = parseInt(easyElement.value) + 1;
      else hardElement.value = parseInt(hardElement.value) + 1;
   };

   const decrease = (level) => {
      totalElement.value = parseInt(totalElement.value) - 1;
      if (level == "0") easyElement.value = parseInt(easyElement.value) - 1;
      else hardElement.value = parseInt(hardElement.value) - 1;
   };

   function getQuestionList(e) {
      const checkbox = e.target.closest("input[type='checkbox']");
      if (!checkbox) return;
      let question = {};
      if (checkbox.checked === true) {
         increase(checkbox.dataset.level);
      } else if (checkbox.checked === false) {
         decrease(checkbox.dataset.level);
      }
   }

   // ----- Fetch API to get Chapters from Subject -----

   const getExamChapter = async () => {
      // setIsLoadingData(true);
      await fetch(`${api}/classes/841109222-12/chapters`, {
         headers: {
            Authorization: "Bearer " + currentUser,
         },
      })
         .then((data) => data.json())
         .then((data) => {
            setExamChapter(data.data);
            setIsLoadingData(false);
         });
   };
   useEffect(() => {
      getExamChapter();
   }, []);

   // ----- Fetch API to get Questions from Chapters -----

   const handleChapterGuide = (length) => {
      if (length === 0)
         document.querySelector(".chapter-guide").style.display = "flex";
      else document.querySelector(".chapter-guide").style.display = "none";
   };

   const getExamQuestions = async () => {
      setIsLoadingData(true);
      await fetch(
         `${api}/classes/841109222-12/chapters/questions?chapters=${chapters.join(
            ","
         )}`,
         {
            headers: {
               Authorization: "Bearer " + currentUser,
            },
         }
      )
         .then((data) => data.json())
         .then((data) => {
            setExamQuestions(data.data);
            setIsLoadingData(false);
         });
   };

   useEffect(() => {
      getExamQuestions();
      handleChapterGuide(chapters.length);
   }, [chapters]);

   const handleRemoveChapter = (chapter) => {
      setChapters(chapters.filter((item) => item !== chapter));
   };

   // ----- Handle when select type of created-method -----

   useEffect(() => {
      const totalQuestion = document.getElementById("totalQuestions");
      const easyQuestion = document.getElementById("easy");
      const hardQuestion = document.getElementById("hard");
      if (type === 1 || type === "1") {
         clearErrorMessage(".form-message.totalQuestions");
         clearErrorMessage(".form-message.easy");
         clearErrorMessage(".form-message.hard");

         handleType1(totalQuestion, easyQuestion, hardQuestion);
      } else {
         handleType2_3(totalQuestion, easyQuestion, hardQuestion);

         document
            .querySelectorAll("input[type='checkbox']")
            .forEach((checkbox) => {
               checkbox.checked = false;
               checkbox.disabled = true;
            });

         setQuestionArray([]);
      }
   }, [type]);

   const handleChapterMenu = (e) => {
      e.stopPropagation();
      document.querySelector(".chapter-menu").classList.toggle("display-flex");
      handleChapterGuide(chapters.length);
   };

   return (
      <div
         className="flex-center"
         style={selectFromBankLayout}
         onClick={() => {
            document
               .querySelector(".chapter-menu")
               .classList.remove("display-flex");
         }}
      >
         <form
            action=""
            method="POST"
            id="form--create-exam__selectFromBank"
            style={{
               display: "flex",
               width: "100%",
               height: "100%",
               position: "relative",
            }}
            onClick={getQuestionList}
         >
            <div
               className="flex-center position-relative"
               style={{
                  width: "450px",
                  maxHeight: "100%",
                  borderRight: "1px solid #d5d5d5",
                  paddingRight: "25px",
               }}
            >
               <div
                  className="position-absolute flex-center"
                  style={{
                     top: "0px",
                     left: "0px",
                     justifyContent: "space-between",
                     width: "100%",
                     paddingRight: "25px",
                  }}
               >
                  <h2
                     style={{
                        fontWeight: "600",
                        fontSize: "1.6rem",
                        lineHeight: "2.1rem",
                        color: "#424242",
                     }}
                  >
                     Chọn từ ngân hàng đề
                  </h2>

                  <select
                     name="type"
                     id="type"
                     style={{
                        width: "150px ",
                        height: "25px",
                        textAlign: "center",
                        border: "solid 2px #BFBFBF",
                        borderRadius: "4px",
                     }}
                     onChange={(e) => setType(e.target.value)}
                  >
                     <option value="1">Tự chọn</option>
                     <option value="2">Ngẫu nhiên cho lớp</option>
                     <option value="3">Ngẫu nhiên</option>
                  </select>
               </div>

               <ul className="flex-center flex-direction-col" style={inputList}>
                  <li
                     className="flex-center form-group"
                     style={{
                        width: "100%",
                        margin: "5px 0",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        height: "40px",
                     }}
                  >
                     <label htmlFor="name" style={label} className="form-label">
                        Tên bài thi
                     </label>

                     <div
                        style={{
                           flex: "1",
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "flex-start",
                        }}
                     >
                        <input
                           rules="require"
                           className="form-control"
                           type="text"
                           name="name"
                           id="name"
                           placeholder="Nhập tên bài thi"
                           style={{
                              fontSize: "1.4rem",
                              paddingLeft: "10px",
                              flex: "1",
                              height: "30px",
                              outline: "none",
                              borderRadius: "4px",
                              border: "solid 2px #BFBFBF",
                           }}
                        />
                        <label htmlFor="name" className="form-message"></label>
                     </div>
                  </li>

                  <li
                     className="flex-center form-group"
                     style={{
                        width: "100%",
                        margin: "5px 0",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        height: "40px",
                     }}
                  >
                     <label htmlFor="examId" style={label}>
                        Mã đề
                     </label>
                     <div
                        style={{
                           flex: "1",
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "flex-start",
                        }}
                     >
                        <input
                           rules="require"
                           className="form-control"
                           type="text"
                           name="examId"
                           id="examId"
                           placeholder="Nhập mã đề"
                           style={{
                              fontSize: "1.4rem",
                              paddingLeft: "10px",
                              flex: "1",
                              height: "30px",
                              outline: "none",
                              borderRadius: "4px",
                              border: "solid 2px #BFBFBF",
                           }}
                        />
                        <label
                           htmlFor="examId"
                           className="form-message"
                        ></label>
                     </div>
                  </li>

                  <li
                     className="flex-center form-group"
                     style={{
                        width: "100%",
                        margin: "5px 0",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        height: "40px",
                     }}
                  >
                     <label
                        htmlFor="timeStart"
                        style={label}
                        className="form-label"
                     >
                        Thơi gian bắt đầu
                     </label>
                     <div
                        style={{
                           flex: "1",
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "flex-start",
                        }}
                     >
                        <input
                           rules="require"
                           className="form-control"
                           type="datetime-local"
                           name="timeStart"
                           id="timeStart"
                           style={{
                              fontSize: "1.4rem",
                              paddingLeft: "10px",
                              flex: "1",
                              height: "30px",
                              outline: "none",
                              borderRadius: "4px",
                              border: "solid 2px #BFBFBF",
                           }}
                        />
                        <label
                           htmlFor="timeStart"
                           className="form-message"
                        ></label>
                     </div>
                  </li>

                  <li
                     className="flex-center form-group"
                     style={{
                        width: "100%",
                        margin: "5px 0",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        height: "40px",
                     }}
                  >
                     <label
                        htmlFor="timeEnd"
                        style={label}
                        className="form-label"
                     >
                        Thời gian kết thúc
                     </label>
                     <div
                        style={{
                           flex: "1",
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "flex-start",
                        }}
                     >
                        <input
                           rules="require"
                           className="form-control"
                           type="datetime-local"
                           name="timeEnd"
                           id="timeEnd"
                           style={{
                              fontSize: "1.4rem",
                              paddingLeft: "10px",
                              flex: "1",
                              height: "30px",
                              outline: "none",
                              borderRadius: "4px",
                              border: "solid 2px #BFBFBF",
                           }}
                        />
                        <label
                           htmlFor="timeEnd"
                           className="form-message"
                        ></label>
                     </div>
                  </li>

                  <li
                     className="flex-center form-group"
                     style={{
                        width: "100%",
                        margin: "5px 0",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        height: "40px",
                     }}
                  >
                     <label
                        htmlFor="duration"
                        style={label}
                        className="form-label"
                     >
                        Thời gian
                     </label>

                     <div
                        style={{
                           flex: "1",
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "flex-start",
                        }}
                     >
                        <input
                           rules="require"
                           className="form-control"
                           type="text"
                           name="duration"
                           id="duration"
                           placeholder="Nhập số phút"
                           style={{
                              width: "150px",
                              fontSize: "1.4rem",
                              paddingLeft: "10px",
                              flex: "1",
                              height: "30px",
                              outline: "none",
                              borderRadius: "4px",
                              border: "solid 2px #BFBFBF",
                              textAlign: "center",
                           }}
                        />
                        <label
                           htmlFor="duration"
                           className="form-message"
                        ></label>
                     </div>
                  </li>

                  <li
                     className="flex-center form-group"
                     style={{
                        width: "100%",
                        margin: "5px 0",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        height: "40px",
                     }}
                  >
                     <label
                        htmlFor="totalQuestions"
                        style={label}
                        className="form-label"
                     >
                        Số câu hỏi
                     </label>

                     <div
                        style={{
                           flex: "1",
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "flex-start",
                        }}
                     >
                        <input
                           rules="require"
                           className="form-control"
                           type="text"
                           name="totalQuestions"
                           id="totalQuestions"
                           style={{
                              width: "150px",
                              fontSize: "1.4rem",
                              paddingLeft: "10px",
                              flex: "1",
                              height: "30px",
                              outline: "none",
                              borderRadius: "4px",
                              border: "solid 2px #BFBFBF",
                              textAlign: "center",
                           }}
                        />
                        <label
                           htmlFor="totalQuestions"
                           className="form-message totalQuestions"
                        ></label>
                     </div>
                  </li>

                  <li
                     className="flex-center form-group"
                     style={{
                        width: "100%",
                        margin: "5px 0",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        height: "40px",
                     }}
                  >
                     <label htmlFor="easy" style={label} className="form-label">
                        Dễ
                     </label>

                     <div
                        style={{
                           flex: "1",
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "flex-start",
                        }}
                     >
                        <input
                           rules="require"
                           className="form-control"
                           type="text"
                           name="easy"
                           id="easy"
                           style={{
                              width: "150px",
                              fontSize: "1.4rem",
                              paddingLeft: "10px",
                              flex: "1",
                              height: "30px",
                              outline: "none",
                              borderRadius: "4px",
                              border: "solid 2px #BFBFBF",
                              textAlign: "center",
                           }}
                        />
                        <label
                           htmlFor="easy"
                           className="form-message easy"
                        ></label>
                     </div>
                  </li>

                  <li
                     className="flex-center form-group"
                     style={{
                        width: "100%",
                        margin: "5px 0",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        height: "40px",
                     }}
                  >
                     <label htmlFor="hard" style={label} className="form-label">
                        Khó
                     </label>

                     <div
                        style={{
                           flex: "1",
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "flex-start",
                        }}
                     >
                        <input
                           rules="require"
                           className="form-control"
                           type="text"
                           name="hard"
                           id="hard"
                           style={{
                              width: "150px",
                              fontSize: "1.4rem",
                              paddingLeft: "10px",
                              flex: "1",
                              height: "30px",
                              outline: "none",
                              borderRadius: "4px",
                              border: "solid 2px #BFBFBF",
                              textAlign: "center",
                           }}
                        />
                        <label
                           htmlFor="hard"
                           className="form-message hard"
                        ></label>
                     </div>
                  </li>
               </ul>
            </div>

            <div
               style={{
                  flex: "1",
                  height: "530px",
                  marginTop: "35px",
                  overflow: "hidden",
               }}
            >
               <div
                  className="position-absolute flex-center"
                  style={{
                     top: "0%",
                     right: "0",
                     width: "calc(100% - 450px)",
                     padding: "0 3%",
                     marginBottom: "0px",
                     backgroundColor: "#fff",
                  }}
                  onClick={(e) => handleChapterMenu(e)}
               >
                  <ul
                     style={{
                        flex: 1,
                        display: "flex",
                        flexWrap: "nowrap",
                        overflowX: "scroll",
                        width: "100%",
                        height: "45px",
                        whiteSpace: "nowrap",
                     }}
                     className="list__selected-chapter"
                  >
                     <li
                        className="flex-center chapter-guide"
                        style={{
                           fontSize: "1.6rem",
                           color: "#777",
                           paddingLeft: "20px",
                        }}
                     >
                        Vui lòng chọn chương
                     </li>
                     {chapters.map((chapter) => (
                        <li
                           className=" flex-center chapter"
                           name="chapter"
                           id={chapter}
                           style={{
                              width: "90px",
                              color: "var(--primary-color)",
                              borderColor: "var(--primary-color)",
                           }}
                           onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveChapter(chapter);
                           }}
                        >
                           <span>Chương {chapter}</span>
                        </li>
                     ))}
                  </ul>
                  <div
                     id="select-chapter"
                     style={{
                        color: "##444444",
                        fontSize: "1.4rem",
                        fontWeight: "600",
                        width: "40px",
                        textAlign: "right",
                     }}
                  >
                     <i class="fa-solid fa-chevron-down"></i>
                  </div>

                  <ul
                     className="chapter-menu"
                     onClick={(e) => e.stopPropagation()}
                  >
                     {examChapter.map((chapter, index) => {
                        if (chapter.name !== "Chương chung") {
                           return (
                              <li
                                 className="chapter flex-center"
                                 onClick={() => {
                                    if (
                                       chapters.find(
                                          (item) => item === index
                                       ) === undefined
                                    )
                                       setChapters((prev) => [...prev, index]);
                                 }}
                              >
                                 <span>Chương {index}</span>
                              </li>
                           );
                        }
                     })}
                  </ul>
               </div>

               <ul
                  className="flex-center flex-direction-col question-list position-relative"
                  style={{
                     flex: "1",
                     height: "96%",
                     paddingLeft: "10px",
                     overflowY: "scroll",
                     width: "100%",
                     paddingTop: "0",
                     justifyContent: "flex-start",
                  }}
               >
                  {examQuestions.map((item) => (
                     <Question questionObject={item} />
                  ))}
                  {isLoadingData && <LoadingData />}
               </ul>
            </div>
            <button
               style={{
                  width: "125px",
                  height: "35px",
                  backgroundColor: "#1F2EC9",
                  borderRadius: "5px",
                  position: "absolute",
                  bottom: "0px",
                  left: "calc((450px - 25px - 125px)/2)",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  fontSize: "1.5rem",
                  letterSpacing: "1px",
               }}
            >
               Tạo
            </button>
         </form>
      </div>
   );
}

export default SelectFromBank;
