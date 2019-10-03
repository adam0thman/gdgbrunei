## Auction Web App with Firebase Cloud Firestore for backend
This was created for an introductory workshop for GDG Brunei on Firebase's Cloud Firestore. The workshop is 'Create a Realtime Web App with Firebase's Cloud Firestore`, and was held on 3rd October 2019

This was created by Adam Othman and Lim Xin Ying

# Firestore format
Two collections:
1. 'currentbid' has only one document: 'currentbid'. Contains the current highest bid
2. 'allBids' contains all bids

A 'Bid' is an object with
- bidder (string)
- amount (number)
- timestamp