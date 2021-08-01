const inquirer = require("inquirer");

const mainQuestions = [
  {
    type: "list",
    name: "type_crawler",
    message: "Vui lòng chọn một loại thu thập dữ liệu.",
    choices: [
      {
        name: "Stable tienphong.vn (nhanh, ổn định)",
        value: "stable_tienphong",
      },
      {
        name: "Perform tienphong.vn (chậm, trình diễn)",
        value: "perform_tienphong",
      },
    ],
  },
  {
    type: "list",
    name: "type_export",
    message: "Vui lòng chọn định dạng dữ liệu cần xuất.",
    choices: [
      {
        name: "JSON (định dạng json)",
        value: "json",
      },
      {
        name: "CSV (định dạng csv)",
        value: "csv",
      },
      {
        name: "Xuất tất cả định dạng",
        value: "all",
      },
    ],
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
