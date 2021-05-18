const { admin } = require('./admin');
const db = admin.firestore();

const getCollectionDocs = async (collection) => {
  const collectionRef = db.collection(collection);

  return collectionRef.get().then((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id, // Ignore the id field from the DB, it's just a dummy placeholder
    }));
    return data;
  });
};

const setProblemContent = async (metadata, content) => {
  const contentsCollectionRef = db
    .collection('/problem_contents')
    .where('server_id', '==', metadata.server_id);

  const ref = await contentsCollectionRef.get();

  if (ref.empty) {
    await db
      .collection('/problem_contents')
      .doc()
      .set(
        {
          content,
          server_id: metadata.server_id,
          language: metadata.language,
          created_at: new Date(Date.now()).toLocaleString(),
        },
        { merge: true },
      );
  } else {
    if (ref.docs.length > 1) {
      console.log(
        `More than 1 entry found for ${metadata.server_id}. No update was done.`,
      );
      return;
    }

    const docId = ref.docs[0].id;
    await db
      .collection('/problem_contents')
      .doc(docId)
      .set(
        {
          content,
          server_id: metadata.server_id,
          language: metadata.language,
          updated_at: new Date(Date.now()).toLocaleString(),
        },
        { merge: true },
      );
  }

  console.log(`${metadata.server_id} updated.`);
};

module.exports = {
  setProblemContent,
};
