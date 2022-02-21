const SftpUpload = require("sftp-upload");
const colors = require("colors/safe");
const Gauge = require("gauge");

// 上传本地目录下文件
const upload = (config) => {
  const sftp = new SftpUpload(config);
  const gauge = new Gauge();
  gauge.show("uploading", 0);
  return new Promise((resolve) => {
    sftp
      .on("error", function (err) {
        throw err;
      })
      .on("uploading", function (progress) {
        gauge.pulse();
        gauge.show(
          "uploading " + colors.blue(progress.file),
          progress.percent / 100
        );
        // console.log('Uploading', colors.yellow(progress.file))
        // console.log(colors.blue(progress.percent + '% completed'))
      })
      .on("completed", function () {
        gauge.hide();
        console.log(colors.green("Upload Completed"));
        resolve(sftp);
      })
      .upload();
  });
};

upload({
  host: "1", // 服务器ip，域名
  port: 22, // 端口
  username: "root", // 用户
  password: "ct, // 密码
  path: "docs/.vuepress/dist", // 本地路径
  remoteDir: "/home/ect/ect-ui-docs/" // 远程目录
});
