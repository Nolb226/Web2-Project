import api from "../../../config/config.js";

function validator(formSelector) {
   let formElement = document.querySelector(formSelector);

   let formRules = {};

   const getParentElement = (childElement, parentSelector) => {
      while (childElement.parentElement) {
         if (childElement.parentElement.matches(parentSelector)) {
            return childElement.parentElement;
         }
         childElement = childElement.parentElement;
      }
   };

   var validatorRules = {
      require: (value) => {
         return value ? undefined : "Vui lòng nhập thông tin";
      },

      dateOfBirth: (value) => {
         return value ? undefined : "Vui lòng chọn ngày tháng năm sinh";
      },

      major: (value) => {
         return value !== "Ngành" ? undefined : "Vui lòng chọn ngành học";
      },

      min: (min) => {
         return (value) =>
            value.length >= min ? undefined : `Tối thiểu ${min} kí tự`;
      },

      max: (max) => {
         return (value) =>
            value.length <= max ? undefined : `Tối đa ${max} kí tự`;
      },
   };

   if (formElement) {
      var inputs = formElement.querySelectorAll("[name][rules]");

      const clearErrorMessage = (event) => {
         let parentElement = getParentElement(event.target, ".form-group");
         parentElement.classList.remove("invalid");
         parentElement.querySelector(".form-message").innerText = "";
      };

      // Lắng nghe sự kiện trên từng thẻ input
      const handelValidate = (event) => {
         var rules = formRules[event.target.name];
         var errorMessage;

         rules.find(function (rule) {
            errorMessage = rule(event.target.value);
            return errorMessage;
         });

         let parentElement = getParentElement(event.target, ".form-group");

         if (errorMessage) {
            parentElement.classList.add("invalid");
            parentElement.querySelector(
               ".form-message"
            ).innerText = `* ${errorMessage}`;
         }

         return !errorMessage;
      };

      // Lặp và gán function validator cho từng thẻ input
      inputs.forEach((input) => {
         var rules = input.getAttribute("rules").split("|");

         rules.forEach((rule) => {
            var ruleFunction;
            ruleFunction = validatorRules[rule];

            if (rule.includes(":")) {
               // rule = "min:8"
               var temp = rule.split(":"); // temp[0] = "min", temp[1] = "8"
               rule = temp[0]; // rule = "min"
               ruleFunction = validatorRules[rule]; // ruleFunction = min()
               ruleFunction = ruleFunction(temp[1]); // ruleFunction =  min(8) return (value) =>  value.length > min ? undefined : `Tối thiểu ${8} kí tự`;
            }

            if (Array.isArray(formRules[input.name]))
               formRules[input.name].push(ruleFunction);
            else formRules[input.name] = [ruleFunction];
         });

         input.onblur = handelValidate;
         input.oninput = clearErrorMessage;
      });

      // Sign up new account
      if (formSelector === "#form-register") {
         formElement.onsubmit = (event) => {
            event.preventDefault();
            var isValid = true;
            let formData = new FormData();

            inputs.forEach((input) => {
               if (!handelValidate({ target: input })) {
                  isValid = false;
               }
            });

            if (isValid) {
               let typeName = formElement.querySelector(".type");
               formData.append("type", typeName.getAttribute("name"));

               inputs.forEach((input) => {
                  formData.append(input.name, input.value);
               });
            }
            fetch(`${api}/auth/signup`, {
               body: formData,
               method: "post",
            });
         };
      }

      // Create handicraft exam
      if (formSelector === "#form--create-exam") {
         console.log("validate for handily exam");
         formElement.onsubmit = (event) => {
            event.preventDefault();
            var isValid = true;
            let questionArray = [];
            let arr = [];
            let formData = new FormData();
            const questionList = formElement.querySelector(".question-list");
            let questionBoxes = questionList.querySelectorAll(".question-box");

            inputs.forEach((input) => {
               if (!handelValidate({ target: input })) {
                  isValid = false;
               }
            });
            const currentUser = localStorage.getItem("currentUser");

            if (isValid) {
               var easy = 0;
               var hard = 0;
               // Get data from exam information
               inputs.forEach((input) => {
                  if (input.closest(".exam-information")) {
                     arr.push({ [input.name]: input.value });
                     formData.append(input.name, input.value);
                  }
               });

               // Get data from every question box
               questionBoxes.forEach((box) => {
                  let question = {};

                  // correct answer
                  question["correctAns"] = box.querySelector(
                     `input[type="radio"]:checked`
                  ).value;

                  // level of question
                  const level = box.querySelector("#level").value;
                  question["level"] = level;

                  level === "0" ? (easy += 1) : (hard += 1);

                  console.log(level);

                  // answers
                  box.querySelectorAll("input[type=text]").forEach((item) => {
                     question[`${item.name}`] = item.value;
                  });

                  questionArray.push(question);
               });

               formData.append("totalQuestions", questionBoxes.length);
               formData.append("easy", easy);
               formData.append("hard", hard);
               formData.append("type", 0);
               formData.append("questions", JSON.stringify(questionArray));
            }

            fetch(`${api}/classes/841109222-12/exams?type`, {
               body: formData,
               method: "POST",
               headers: {
                  Authorization: "Bearer " + currentUser,
               },
            });
         };
      }

      // Create select from bank exam
      if (formSelector === "#form--create-exam__selectFromBank") {
         formElement.onsubmit = (event) => {
            event.preventDefault();
            var isValid = true;
            let questionArray = [];
            let arr = [];
            let formData = new FormData();

            const questionList = formElement.querySelector(".question-list");
            let questionBoxes = questionList.querySelectorAll(".question-box");

            const type = formElement.querySelector("select[name=type]");
            // console.log(type.value);

            // if (type.value === 1) {
            //    document.getElementById("hard").style.disabled = "true";
            // }

            // --- Validate for question list

            inputs.forEach((input) => {
               if (!handelValidate({ target: input })) {
                  isValid = false;
               }
            });
            const currentUser = localStorage.getItem("currentUser");

            if (isValid) {
               // Get data from exam information
               inputs.forEach((input) => {
                  if (input.closest(".exam-information")) {
                     arr.push({ [input.name]: input.value });
                     formData.append(input.name, input.value);
                  }
               });

               // Get data from every question box
               questionBoxes.forEach((box) => {
                  let question = {};

                  question["id"] = box.id;

                  questionArray.push(question);
               });

               formData.append("type", type.value);
               formData.append("questions", JSON.stringify(questionArray));
            }

            fetch(`${api}/test`, {
               body: formData,
               method: "POST",
               headers: {
                  Authorization: "Bearer " + currentUser,
               },
            });
         };
      }
   }
}

export default validator;
