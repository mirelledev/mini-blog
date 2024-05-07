import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// O código importa as funções necessárias do React e do Firebase Firestore,
// incluindo useState, useEffect, useReducer, db, collection, addDoc e Timestamp.

const initialState = {
  loading: null,
  error: null,
};

// Define o estado inicial do hook, contendo informações sobre o carregamento e erros.
// Em seguida, define um reducer chamado insertReducer, que atualiza o estado com base
// nas ações recebidas.

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Declara o hook useInsertDocument, que recebe o nome da coleção de
// documentos como argumento. Ele utiliza o useReducer para gerenciar o
// estado de carregamento e erros.

export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);

  const [cancelled, setCancelled] = useState(false);

  // Uma função auxiliar que verifica se o hook foi cancelado antes de
  // despachar uma ação para o reducer. Isso é importante para evitar atualizações
  // de estado desnecessárias caso o componente que está utilizando o hook seja
  // desmontado antes da conclusão da operação.

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const insertDocument = async (document) => {
    checkCancelBeforeDispatch({ type: "LOADING" });
    // Uma função assíncrona que recebe um documento como argumento.
    // Antes de começar a adicionar o documento ao Firestore, ela despacha uma
    // ação de "LOADING" para indicar que a operação está em andamento.
    // Em seguida, tenta adicionar o documento à coleção no Firestore.
    // Se a operação for bem-sucedida, despacha uma ação de "INSERTED_DOC"
    // com o documento inserido. Caso contrário, despacha uma ação de "ERROR"
    // com a mensagem de erro correspondente.
    try {
      const newDocument = { ...document, createdAt: Timestamp.now() };

      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      );

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument,
      });
    } catch (error) {
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
    }
  };

  return { insertDocument, response };
};
