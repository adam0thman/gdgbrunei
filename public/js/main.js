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

    //1. Creating listener to update current highest bid
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

    //2. Adding currentbid to Collection currentbid, Doc currentbid
    // $('#btnBid').on('click', function () {
    //   $('#btnBid').prop('disabled', true);
    //   var bidderName = $('#inputName').val();
    //   var docRef = db.collection('currentbid').doc('currentbid');
    //   docRef.update({
    //     amount: firebase.firestore.FieldValue.increment(13),
    //     bidder: bidderName,
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp()
    //   }).then(() => {
    //     console.log('Done update!');
    //     setTimeout(function () {
    //       if ($('#inputName').val()) {
    //         $('#btnBid').prop('disabled', false);
    //       }
    //     }, 3000);
    //   }).catch((e) => {
    //     console.log('Error updating data: ' + e);
    //   });
    // });

    //3. Running a transaction to update currentBid and add to list of previous bids
    //when using this, comment no 2
    $('#btnBid').on('click', function () {
      $('#btnBid').prop('disabled', true);
      var bidderName = $('#inputName').val();
      var currentBidRef = db.collection('currentbid').doc('currentbid');

      //runTransaction
      db.runTransaction(async function(transaction) {
        //read values must come before writes
        var lastBidSnap = await transaction.get(currentBidRef)
        var lastBid = lastBidSnap.data()
        var docRef = db.collection('allBids').doc()
        var newBid = {
          amount : lastBid.amount + 13,
          //amount: firebase.firestore.FieldValue.increment(13),
          bidder: bidderName,
          timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        }
        return transaction.update(currentBidRef, newBid)
        .set(docRef,newBid)
        
      }).then(() => {
        console.log('Done update!');
        setTimeout(function () {
          if ($('#inputName').val()) {
            $('#btnBid').prop('disabled', false);
          }
        }, 3000);
      }).catch((e) => {
        console.log('Error updating data: ' + e);
      })

 
    });
  
    //4. Showing previous ten bids: Collection querying
    db.collection("allBids").orderBy("timestamp", "desc").limit(10)
    .onSnapshot(function(querySnapshot) {
      //var bidStrings = [];
      console.log("received AllBids")
      console.log(querySnapshot)
      $('#prev_bids').empty()
      querySnapshot.forEach(function(doc) {
        var text = doc.data().bidder + " bid " + doc.data().amount
        console.log(text)
         $('#prev_bids').append('<li>'+ text +'</li>')
        // var listItem = document.createElement('li')
        // listItem.innerText = text//doc.data().bidder + " bid " + doc.data().amount
        // $('#prev_bids').append(listItem)
      })
    });

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


  //Future: Firebase Auth with admin roles, admins are allowed to change items