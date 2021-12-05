const pup = require("puppeteer");
//These Lines will get a fake email from tempmail.io
const FakeEmailGetter = async (bro) => {
  var url = "https://tempmailo.com/";
  var email;

  var tempMail = await bro.newPage();
  await tempMail.goto(url, { waitUntil: "load" });
  await tempMail.waitForSelector("#i-email");

  email = await tempMail.evaluate(() => {
    var mail = document.querySelector("#i-email").value;
    return mail;
  });

  return email;
};

const SignUpInsta = async () => {
  const bro = await pup.launch({
    headless: false,
    executablePath:
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: { width: 1600, height: 800 },
  });

  let url = "https://www.instagram.com/accounts/emailsignup/";

  var email = await FakeEmailGetter(bro);

  let insta = await bro.newPage();
  //These Lines will fill the form
  await insta.goto(url, { waitUntil: ["networkidle0", "load"] });
  await insta.type("[name=emailOrPhone]", email, { delay: 200 });
  await insta.type("[name=fullName]", "Random Noob", { delay: 200 });
  await insta.waitForTimeout(3000);
  await insta.evaluate(() => {
    document.querySelector(".coreSpriteInputRefresh.Szr5J").click();
  });
  await insta.type("[name=password]", "loadmera@16kilo", { delay: 200 });
  await insta.waitForTimeout(3000);
  await insta.evaluate(() => {
    document.querySelector("[type=submit]").click();
  });

  await insta.waitForTimeout(3000);
  await insta.select("select[title='Year:']", "1999");
  await insta.select("select[title='Month:']", "4");
  await insta.select("select[title='Day:']", "1");
  await insta.waitForTimeout(2200);
  await insta.evaluate(() => {
    document.querySelectorAll("[type=button]")[1].click();
  });

  //

  // Fetching the OTP which was send to it

  var tempMail = await bro.newPage();

  var temp_url = "https://tempmailo.com/";
  await tempMail.goto(temp_url, { waitUntil: "load" });

  await tempMail.waitForSelector("#i-email");
  var result = 0;

  while (result == 0) {
    await tempMail.waitForTimeout(3000);
    result = await tempMail.evaluate(() => {
      document.querySelector(".prim-btn").click();
      var val = document.querySelector(".title").textContent;
      if (val !== "Hello") {
        console.log(val);
        var otp = document
          .querySelector("[class=mail-item-sub]")
          .textContent.slice(0, 6);
        return otp;
      }
      return 0;
    });
    console.log(result);
  }

  // Bring Insta to front//

  await insta.bringToFront();
  //"[name=email_confirmation_code]"
  await insta.waitForTimeout(2000);
  await insta.type("[name=email_confirmation_code]", result, { delay: 200 });
  await insta.waitForTimeout(2000);
  await insta.click("[type=submit]");

  // document.querySelector("[class=mail-item-sub]").textContent.slice(0,6)
};

SignUpInsta();
