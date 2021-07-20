import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

const addBookReview = functions
  .region('us-west2')
  .https.onCall(async (data, context) => {
    // App Check Verification
    if (!context.app && process.env.NODE_ENV === 'production') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.'
      );
    }

    // Auth Verification
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    if (typeof context.auth.token.role === 'undefined') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The caller must already have a set role.'
      );
    }

    if (!context.auth.token.permissions.REVIEW_BOOKS) {
      throw new functions.https.HttpsError(
        'permission-denied',
        "The user calling the function must have the 'REVIEW_BOOKS' permission."
      );
    }

    if (
      typeof data.bookID !== 'string' ||
      typeof data.score !== 'number' ||
      typeof data.reviewText !== 'string'
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a bookID, score, and reviewText'
      );
    }

    const reviewData = {
      author: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      perspectiveResults: {
        raw: {
          TOXICITY: 0,
          SEVERE_TOXICITY: 0,
          IDENTITY_ATTACK: 0,
          INSULT: 0,
          PROFANITY: 0,
          THREAT: 0,
        },
        flagged: false,
      },
    };
    if (
      data.reviewText.length > 0 &&
      typeof functions.config().perspective !== 'undefined'
    ) {
      const perspectiveResultRaw = await fetch(
        `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${
          functions.config().perspective.api_key
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment: { text: data.reviewText },
            languages: ['en'],
            requestedAttributes: {
              TOXICITY: {},
              SEVERE_TOXICITY: {},
              IDENTITY_ATTACK: {},
              INSULT: {},
              PROFANITY: {},
              THREAT: {},
            },
            doNotStore: true,
            spanAnnotations: false,
          }),
          method: 'POST',
        }
      );

      const perspectiveResult = await perspectiveResultRaw.json();

      reviewData.perspectiveResults = {
        raw: {
          TOXICITY:
            perspectiveResult.attributeScores.TOXICITY.summaryScore.value,
          SEVERE_TOXICITY:
            perspectiveResult.attributeScores.SEVERE_TOXICITY.summaryScore
              .value,
          IDENTITY_ATTACK:
            perspectiveResult.attributeScores.IDENTITY_ATTACK.summaryScore
              .value,
          INSULT: perspectiveResult.attributeScores.INSULT.summaryScore.value,
          PROFANITY:
            perspectiveResult.attributeScores.PROFANITY.summaryScore.value,
          THREAT: perspectiveResult.attributeScores.THREAT.summaryScore.value,
        },
        flagged: false,
      };
      const flagLevel = 0.8;
      if (
        reviewData.perspectiveResults.raw.TOXICITY > flagLevel ||
        reviewData.perspectiveResults.raw.SEVERE_TOXICITY > flagLevel ||
        reviewData.perspectiveResults.raw.IDENTITY_ATTACK > flagLevel ||
        reviewData.perspectiveResults.raw.INSULT > flagLevel ||
        reviewData.perspectiveResults.raw.PROFANITY > flagLevel ||
        reviewData.perspectiveResults.raw.THREAT > flagLevel
      )
        reviewData.perspectiveResults.flagged = true;
    } else {
      reviewData.perspectiveResults = {
        raw: {
          TOXICITY: 0,
          SEVERE_TOXICITY: 0,
          IDENTITY_ATTACK: 0,
          INSULT: 0,
          PROFANITY: 0,
          THREAT: 0,
        },
        flagged: false,
      };
    }
    return reviewData;
  });

export default addBookReview;
