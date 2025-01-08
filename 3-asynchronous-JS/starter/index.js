const fs = require('fs');
const { resolve } = require('path');
const superagent = require('superagent');
const { reject } = require('superagent/lib/request-base');
const readFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if(err) reject('I could not find that file');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  fs.writeFile(file, data, err => {
    if (err) reject('Could not write file');
    resolve('success');
  })
}

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`); //Pauses the execution of the async function until the Promise resolves or rejects.
    console.log(`Breed: ${data}`);

    const res1Pro = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res2Pro = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res3Pro = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map(el => el.body.message)
    console.log(imgs);

    await writeFilePro('dog-img.txt', imgs.join('\n'));
    console.log('Random dog img saved to file!')
  } catch (err) {
    console.log(err);
    throw err;
  }
  return '2: READY';
}

(async () => {
  try {
    console.log('1: Will get dog pics!');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics!');
  } catch(err){
    console.log('ERROR');
  }
})();

// console.log('1: Will get dog pics!');
// const x = getDogPic().then(x => {
//   console.log(x);
//   console.log('3: Done getting dog pics!');
// })
// .catch(err => {
//   console.log('ERROR');
// });

// readFilePro(`${__dirname}/dog.txt`)
//   .then(data => {
//     console.log(`Breed: ${data}`);
//     return superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`);})
//   .then(res => {
//     console.log(res.body.message);

//     return writeFilePro('dog-img.txt', res.body.message)
//   })
//   .then(() => {
//     console.log('Random dog img saved to file!')
//   })
//   .catch(err => {
//     console.log(err)
//   });