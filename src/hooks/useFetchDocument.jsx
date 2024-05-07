import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

// O código começa importando as funções necessárias do React e do
// Firebase Firestore para realizar a operação de obtenção do documento.
// Estas importações incluem useState, useEffect, db (a instância do Firestore),
// doc, e getDoc.

export const useFetchDocument = (docCollection, id) => {
  // Uma função chamada useFetchDocument é declarada, a qual recebe dois argumentos:
  // docCollection, que representa o nome da coleção do Firestore de onde o documento
  // será obtido, e id, que é o identificador único do documento que se deseja obter.

  // Três estados são definidos usando o hook useState:
  // document: Armazena o documento obtido do Firestore.
  // error: Armazena qualquer erro que possa ocorrer durante o processo de obtenção do documento.
  // loading: Indica se a operação de obtenção do documento está em andamento ou não.
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      //  Um efeito é utilizado para realizar a operação de obtenção do
      //  documento sempre que houver uma mudança nos valores de docCollection ou
      //  id. Dentro do efeito, uma função assíncrona é definida para buscar o documento
      //  no Firestore. Se a operação for bem-sucedida, o estado document é atualizado
      //  com os dados do documento; caso contrário, o estado error é atualizado
      //  com a mensagem de erro correspondente.

      if (cancelled) return;

      setLoading(true);

      try {
        const docRef = await doc(db, docCollection, id);

        const docSnap = await getDoc(docRef);

        setDocument(docSnap.data());
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadDocument();
  }, [docCollection, id]);

  //retornamos documento loading e error
  return { document, loading, error };
};
