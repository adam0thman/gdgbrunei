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
    1. Creating listener to update current highest bid
    Reference:
    - https://firebase.google.com/docs/firestore/query-data/listen#events-local-changes
   ###########################################################################################
  */
  // Initialize our firestore call
  const db = firebase.firestore();
  // We specify our colection ID and the document ID
  db.collection("currentbid").doc("currentbid")
    .onSnapshot({
      // Listen for document metadata changes
      includeMetadataChanges: true
    }, function (bidDoc) {
      // After querying the document, the return is a javascript object, under variable bidDoc
      // We can test this with a simple console.log as below:
      console.log(bidDoc.data());
      // We populate 'amount' into it's HTML placeholder
      $('#txtCurrentBid').text(bidDoc.data().amount);
      // We populate the 'current bidder' into its HTML placeholder
      $('#txtCurrentBidder').text(bidDoc.data().bidder);
    });

  /*
   ###########################################################################################
    2. Updating currentbid to Collection currentbid, Document currentbid
    Reference:
    - https://firebase.google.com/docs/firestore/manage-data/add-data#update-datas
   ###########################################################################################
  */
  // $('#btnBid').on('click', function () {
  //   $('#btnBid').prop('disabled', true);
  //   var bidderName = $('#inputName').val();
  //   var bidAmount = $("input[name='bidAmount']:checked").val();
  //   var docRef = db.collection('currentbid').doc('currentbid');
  //   docRef.update({
  //     amount: firebase.firestore.FieldValue.increment(parseInt(bidAmount)),
  //     bidder: bidderName,
  //     timestamp: firebase.firestore.FieldValue.serverTimestamp()
  //   }).then(() => {
  //     console.log('Sucessfully update document with the new highest bidder.s');
  //     $('#inputName').val(null);
  //     setTimeout(function () {
  //       if ($('#inputName').val()) {
  //         $('#btnBid').prop('disabled', false);
  //       }
  //     }, 3000);
  //   }).catch((e) => {
  //     console.log('Error updating data: ' + e);
  //   });
  // });

  /*
   ###########################################################################################
    3. Running a transaction to update currentBid and add to list of previous bids
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
    db.runTransaction(async function (transaction) {
      //read values must come before writes
      var lastBidSnap = await transaction.get(currentBidRef)
      var lastBid = lastBidSnap.data()
      var docRef = db.collection('allBids').doc()
      var newBid = {
        amount: parseInt(lastBid.amount) + parseInt(bidAmount),
        //amount: firebase.firestore.FieldValue.increment(13),
        bidder: bidderName,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
      }
      return transaction.update(currentBidRef, newBid)
        .set(docRef, newBid)

    }).then(() => {
      console.log('Done update!');
      $('#inputName').val(null);
      setTimeout(function () {
        if ($('#inputName').val()) {
          $('#btnBid').prop('disabled', false);
        }
      }, 3000);
    }).catch((e) => {
      console.log('Error updating data: ' + e);
    })
  });

  /*
   ###########################################################################################
    4. Showing previous ten bids: Collection querying
    Reference:
    - https://firebase.google.com/docs/firestore/query-data/listen#listen_to_multiple_documents_in_a_collection
    - https://firebase.google.com/docs/firestore/query-data/queries#compound_queries
   ###########################################################################################
  */
  db.collection("allBids").orderBy("timestamp", "desc").limit(10)
    .onSnapshot(function (querySnapshot) {
      //var bidStrings = [];
      console.log("received AllBids")
      console.log(querySnapshot)
      $('#prev_bids').empty()
      querySnapshot.forEach(function (doc) {
        var text = '<small>$' + doc.data().amount +
          ' <text class="text-muted">bid by</text> <text data-toggle="tooltip" data-placement="right" title="Bid made on ' +
          doc.data().timestamp.toDate() + '">' + doc.data().bidder + '</text></small><br />'
        //console.log(text)
        $('#prev_bids').append(text)
      })
    });
  
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