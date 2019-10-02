document.addEventListener('DOMContentLoaded', function () {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage', 'firestore'].filter(feature => typeof app[feature] === 'function');
    console.log(`Firebase SDK loaded with ${features.join(', ')}`);
  } catch (e) {
    console.error("Error: " + e);
    console.log('Error loading the Firebase SDK, check the Firebase console.');
  }


   /*
   ###########################################################################################
    1. Initializing firestore
    - https://firebase.google.com/docs/firestore/query-data/listen#events-local-changes
   ###########################################################################################
  */
  //TODO1: Initializing firestore


  /*
   ###########################################################################################
    2. Creating listener to update current highest bid
    Reference:
    - https://firebase.google.com/docs/firestore/query-data/listen#events-local-changes
   ###########################################################################################
  */
  // We specify our colection ID and the document ID
    //TODO2: Listen for changes in highest bid

  /*
   ###########################################################################################
    3. Updating currentbid to Collection currentbid, Document currentbid
    Reference:
    - https://firebase.google.com/docs/firestore/manage-data/add-data#update-datas
   ###########################################################################################
  */
  $('#btnBid').on('click', function () {
    $('#btnBid').prop('disabled', true);

    var bidderName = $('#inputName').val();
    var bidAmount = $("input[name='bidAmount']:checked").val();

   //TODO3: Complete the following to update currentbid

   //uncomment the below
  //   .then(() => {
  //     console.log('Sucessfully update document with the new highest bidder.s');
  //     $('#inputName').val(null);
  //     setTimeout(function () {
  //       if ($('#inputName').val()) {
  //         $('#btnBid').prop('disabled', false);
  //       }
  //     }, 3000);
  //   }).catch((e) => {
  //     console.log('Error updating data: ' + e);
    });
  });

  /*
   ###########################################################################################
    4. Running a transaction to update currentBid and add to list of previous bids
    Reference:
    - https://firebase.google.com/docs/firestore/manage-data/transactions#transactions
   ###########################################################################################
  */
  //when using this, comment out no 2
  $('#btnBid').on('click', function () {
    $('#btnBid').prop('disabled', true);
    var bidderName = $('#inputName').val();
    var bidAmount = $("input[name='bidAmount']:checked").val();
    var currentBidRef = db.collection('currentbid').doc('currentbid');

    //runTransaction
    //TODO4: Run transaction to save both 
    
    //uncomment the below
  //   .then(() => {
  //     console.log('Done update!');
  //     $('#inputName').val(null);
  //     setTimeout(function () {
  //       if ($('#inputName').val()) {
  //         $('#btnBid').prop('disabled', false);
  //       }
  //     }, 3000);
  //   }).catch((e) => {
  //     console.log('Error updating data: ' + e);
    // })
  });

  /*
   ###########################################################################################
    5. Showing previous ten bids: Collection querying
    Reference:
    - https://firebase.google.com/docs/firestore/query-data/listen#listen_to_multiple_documents_in_a_collection
    - https://firebase.google.com/docs/firestore/query-data/queries#compound_queries
   ###########################################################################################
  */
  //TODO5 Get previous bids by querying collections
  
  // Monitor the input field with id=#inputName
  // and only enable the Bid button once user
  // input their name.
  $('#inputName').on('input', function () {
    if ($('#inputName').val().length > 0) {
      $('#btnBid').prop('disabled', false);
    } else {
      $('#btnBid').prop('disabled', true);
    }


});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

/*
  Future addition to this code, for upcoming classes in this Firebase Series:

  - Firebase Auth
  - Security Rules
  - Firebase Storage
  - Admin fucntionaloity to changee bid items
 */