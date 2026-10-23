import { db } from './config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  updateDoc,
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

export {
  db,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
};
