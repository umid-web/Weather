import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const useSyncUser = () => {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      console.log('🔥 useSyncUser: Auth state changed');
      console.log('👤 User:', user?.uid, user?.email);
      
      if (!user) {
        console.log('❌ No user, skipping Firestore sync');
        return;
      }

      try {
        console.log('💾 Checking/Creating user document in Firestore...');
        
        // Check if user document already exists
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Only set createdAt for new users
          console.log('🆕 Creating new user document...');
          await setDoc(
            userDocRef,
            {
              displayName: user.displayName || "",
              email: user.email || "",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } else {
          // Only update updatedAt for existing users
          console.log('🔄 Updating existing user document...');
          await setDoc(
            userDocRef,
            {
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
        
        console.log('✅ User document successfully synced for:', user.uid);
      } catch (error) {
        console.error('❌ Error syncing user to Firestore:', error);
      }
    });

    return () => unsub();
  }, []);
};
