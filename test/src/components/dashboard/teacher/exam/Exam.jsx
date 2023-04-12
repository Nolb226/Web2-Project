// import "./style.css";
// import "./responsive.css";
import React, { useState, useEffect } from "react";
import CreateExamModal from "./CreateExamModal";

function Exam() {
   const returnBtn = document.querySelector(".return");

   const handleLock = (Class, examID) => {
      console.log(Class);
      // console.log(Class.isLock);
      // console.log(Class.id);
      // fetch(
      //    `https://bestoftest.herokuapp.com/classes/${Class.id}/exams/${examID}`,
      //    {
      //       method: "PATCH",
      //       body: JSON.stringify({
      //          isLock: !Class.isLock,
      //       }),
      //       headers: {
      //          Authorization:
      //             "Bearer " +
      //             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjgxMTIxMjA2LCJleHAiOjE2ODEzODA0MDZ9.MGOsmWFQzyO-m5k4ugL9Z71pQ3hsAzJHeRIegMw8AsE",
      //          "Content-type": "application/json",
      //       },
      //    }
      // ).then((response) => response.json());
      // //   .then((json) => console.log(json.data));

      updateLockExam(Class);
   };

   const updateLockExam = (exam) => {
      console.log(exam);
   };

   function ExamList() {
      const [examData, setExamData] = useState([]);
      const getExamData = async () => {
         const request = await fetch(
            "https://bestoftest.herokuapp.com/classes/exams",
            {
               headers: {
                  Authorization:
                     "Bearer " +
                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjgxMTIxMjA2LCJleHAiOjE2ODEzODA0MDZ9.MGOsmWFQzyO-m5k4ugL9Z71pQ3hsAzJHeRIegMw8AsE",
               },
            }
         );
         const response = await request.json();
         if (response.data) {
            setExamData(response.data);
         }
      };

      if (examData.length === 0) {
         getExamData();
      }

      // const checkedBtn = document.querySelectorAll("input[type=checkbox]");
      // checkedBtn.forEach((btn) => {
      //    btn.addEventListener("change", () => {
      //       btn.closest(".table__content--item").getAttribute("key");
      //    });
      // });

      return (
         <>
            <div className="flex-center search-bar">
               <input
                  type="text"
                  className="search-input"
                  placeholder="Nhập mã đề thi"
               />
               <button
                  className="flex-center join-button"
                  onClick={() => {
                     setExamList(false);
                     setClassList(true);
                  }}
               >
                  <i className="menu-icon fa-solid fa-plus"></i>
                  <span>Tạo bài thi</span>
               </button>
            </div>
            <div className="table-zone grid">
               <header className="table__header">
                  <h1 className="table__heading">bài thi đã tạo</h1>
                  <div className="filter-box"></div>
               </header>
               <div className="grid table__content">
                  <ul className="row no-gutters flex-center table__content--heading">
                     <li className="col l-3">
                        <h3>Tên - Mã đề</h3>
                     </li>

                     <li className="col l-3">
                        <h3>Môn</h3>
                     </li>

                     <li className="col l-2">
                        <h3>Đã giao cho</h3>
                     </li>

                     <li className="col l-1">
                        <h3>Đã nộp</h3>
                     </li>

                     <li className="col l-1">
                        <h3>Xem đáp án</h3>
                     </li>

                     <li className="col l-2">
                        <h3>Xuất File điểm</h3>
                     </li>
                  </ul>
                  <div className="table__content--list">
                     {examData.map((exam) => {
                        return (
                           <ul
                              className="row no-gutters flex-center table__content--item"
                              key={exam.id}
                           >
                              <li className="col l-3">
                                 <h3>
                                    {exam.name} - {exam.id}
                                 </h3>
                              </li>

                              <li className="col l-3">
                                 <h3>{exam.lecture_name}</h3>
                              </li>

                              <li className="col l-2">
                                 <h3>{exam.class_id}</h3>
                              </li>

                              <li className="col l-1">
                                 <h3>{exam.totals}</h3>
                              </li>

                              <li className="col l-1">
                                 <input
                                    type="checkbox"
                                    name=""
                                    id=""
                                    checked={!exam.isLock}
                                    onChange={handleLock(exam)}
                                 />
                              </li>
                              <li className="col l-2">
                                 <button className="export-btn">Xuất</button>
                              </li>
                           </ul>
                        );
                     })}
                  </div>
               </div>
            </div>
         </>
      );
   }

   function ClassList() {
      const [classes, setClasses] = useState([]);
      const getClassData = async () => {
         const request = await fetch(
            "https://bestoftest.herokuapp.com/classes",
            {
               headers: {
                  Authorization:
                     "Bearer " +
                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjgxMTIxMjA2LCJleHAiOjE2ODEzODA0MDZ9.MGOsmWFQzyO-m5k4ugL9Z71pQ3hsAzJHeRIegMw8AsE",
               },
            }
         );
         const response = await request.json();
         if (response.data.data) {
            setClasses(response.data.data);
         }
      };

      if (classes.length === 0) getClassData();

      returnBtn.addEventListener("click", () => {
         setClassList(false);
         setExamList(true);
      });

      return (
         <>
            <div className="flex-center search-bar">
               <h2
                  style={{
                     fontWeight: "600",
                     fontSize: "1.7rem",
                     lineHeight: "2.1rem",
                     color: "#555",
                  }}
               >
                  Chọn lớp cần tạo
               </h2>
            </div>
            <div className="table-zone grid">
               <header className="table__header">
                  <h1 className="table__heading">danh sách lớp</h1>
                  <div className="filter-box"></div>
               </header>
               <div className="grid table__content">
                  <ul className="row no-gutters flex-center table__content--heading">
                     <li className="col l-4">
                        <h3>Mã lớp</h3>
                     </li>
                     <li className="col l-4">
                        <h3>Tên</h3>
                     </li>
                     <li className="col l-4">
                        <h3>Môn</h3>
                     </li>
                  </ul>
                  <div className="table__content--list">
                     {classes.map((item, index) => {
                        return (
                           <ul
                              className="row no-gutters flex-center table__content--item"
                              key={index}
                              onClick={() => {
                                 setCreateMethod(!createMethod);
                                 setClassList(!classList);
                              }}
                           >
                              <li className="col l-4">
                                 <h3>{item.id}</h3>
                              </li>
                              <li className="col l-4">
                                 <h3>{item.name}</h3>
                              </li>
                              <li className="col l-4">
                                 <h3>{item.lecture.name}</h3>
                              </li>
                           </ul>
                        );
                     })}
                  </div>
               </div>
            </div>
         </>
      );
   }

   const [typeMethod, setTypeMethod] = useState("");

   function CreateMethod() {
      returnBtn.addEventListener("click", () => {
         setCreateMethod(false);
         setExamList(false);
         setClassList(true);
      });

      return (
         <div className="create-exam flex-center flex-direction-row">
            <div
               className="create-exam__option flex-center flex-direction-col"
               onClick={() => {
                  setCreateMethod(false);
                  setTypeMethod("handicraft");
               }}
            >
               <i className="option-handicraft fa-solid fa-file-pen"></i>
               <h2 className="create-exam__option--title">Tạo đề thủ công</h2>
            </div>

            <div
               className="create-exam__option flex-center flex-direction-col"
               onClick={() => {
                  setCreateMethod(false);
                  setTypeMethod("seclectFromBank");
               }}
            >
               <i className="option-bank fa-solid fa-building-columns"></i>
               <h2 className="create-exam__option--title">
                  Chọn từ ngân hàng đề
               </h2>
            </div>
         </div>
      );
   }

   const [examList, setExamList] = useState(true);
   const [classList, setClassList] = useState(false);
   const [createMethod, setCreateMethod] = useState(false);

   return (
      <>
         {examList && <ExamList />}
         {classList && <ClassList />}

         {createMethod && <CreateMethod />}
         {typeMethod !== "" && (
            <CreateExamModal type={typeMethod} setType={setTypeMethod} />
         )}
      </>
   );
}

export default Exam;