const inquirer = require("inquirer");

const mainQuestions = [
  {
    type: "confirm",
    name: "headless",
    message: "Bạn có muốn chạy crawler trong chế độ ẩn không?",
    default: true,
  },
  {
    type: "list",
    name: "type_export",
    message: "Vui lòng chọn kiểu dữ liệu cần xuất.",
    choices: ["File JSON", "File CSV"],
    filter(val) {
      return val.toLowerCase();
    },
  },
];

module.exports = function questionsToStart() {
  return inquirer
    .prompt(mainQuestions)
    .then((answers) => {
      // Use user feedback for... whatever!!
      console.log("Cài đặt hoàn tất, crawlers sẽ bắt đầu sau vài giây nữa...");
      return answers;
    })
    .catch((err) => console.error(err));
};
