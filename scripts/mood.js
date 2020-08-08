// Firebase configuration
let firebaseConfig = {
  apiKey: 'AIzaSyDy0Igdoa7RuLQPX8K_dBFrDGjJuJpaFK4',
  authDomain: 'website-files-8acf3.firebaseapp.com',
  databaseURL: 'https://website-files-8acf3.firebaseio.com',
  projectId: 'website-files-8acf3',
  storageBucket: 'gs://website-files-8acf3.appspot.com',
  messagingSenderId: '619436936972',
  appId: '1:619436936972:web:6a77d0a5ea9971c8de4329',
  measurementId: 'G-9TCCP8F89F',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.performance();
let storage = firebase.storage();
let ref = storage.ref();
let imgsRef = ref.child('/images');
let cont = document.getElementById('content');

// Find all the prefixes and items.
imgsRef
  .listAll()
  .then(function (res) {
    res.prefixes.forEach(function (folderRef) {
      console.log(folderRef);
    });

    // Append each image
    res.items.forEach(function (itemRef) {
      itemRef
        .getDownloadURL()
        .then(function (url) {
          let img = document.createElement('IMG');

          img.classList.add('moodImg');
          img.classList.add('center');
          img.classList.add('padtopbot');
          img.classList.add('lazy-load');
          img.onload = fadeIn(img);
          img.src = url;
          cont.appendChild(img);
        })
        .catch(function (error) {
          console.log(error, 'Error loading image from directory');
        });
    });
  })
  .catch(function (error) {
    console.log(error, 'Error listing files in directory');
  });

function fadeIn(e) {
  console.log(e);
  e.classList.add('fadeIn');
}
