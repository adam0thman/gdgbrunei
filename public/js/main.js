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
      //document.getElementById('infoload').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
    } catch (e) {
      console.error("Error: " + e);
      //document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }


    const db = firebase.firestore();
    db.collection("currentbid").doc("currentbid")
      .onSnapshot({
        // Listen for document metadata changes
        includeMetadataChanges: true
      }, function (bidDoc) {
        console.log("bidDoc is: " + JSON.stringify(bidDoc.data()));
        $('#txtCurrentBid').text(bidDoc.data().amount);
        $('#txtCurrentBidder').text(bidDoc.data().bidder);
        setTimeout(function () {
          $('#txtBidTime').text(bidDoc.data().timestamp.toDate());
          $('#txtCurrentBid').attr('title', 'Bid placed on ' + bidDoc.data().timestamp.toDate());
          $('#txtCurrentBid').attr('data-original-title', 'Bid placed on ' + bidDoc.data().timestamp.toDate());
          $(function () {
            $('[data-toggle="tooltip"]').tooltip()
          })
        }, 1000);
      });

    $('#inputName').on('input', function () {
      if ($('#inputName').val().length > 0) {
        $('#btnBid').prop('disabled', false);
      } else {
        $('#btnBid').prop('disabled', true);
      }
    });

    $('#btnBid').on('click', function () {
      $('#btnBid').prop('disabled', true);
      var bidderName = $('#inputName').val();
      var docRef = db.collection('currentbid').doc('currentbid');
      docRef.update({
        amount: firebase.firestore.FieldValue.increment(13),
        bidder: bidderName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        console.log('Done update!');
        setTimeout(function () {
          if ($('#inputName').val()) {
            $('#btnBid').prop('disabled', false);
          }
        }, 3000);
      }).catch((e) => {
        console.log('Error updating data: ' + e);
      });
    });
  });

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })