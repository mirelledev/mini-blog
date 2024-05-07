import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

//a gente copiou o hook do insertDocument
//pq tbm usa o useReducer

//O initialState define o estado inicial do hook, que consiste em
//dois campos: loading (para indicar se a operação está em andamento)
//e error (para armazenar mensagens de erro, caso ocorram durante a
//operação).

const initialState = {
  loading: null,
  error: null,
};

// Reducer: O deleteReducer é uma função que especifica como o estado
// é atualizado em resposta a diferentes tipos de ações. As ações
// possíveis são:
// "LOADING": Indica que a operação está em andamento.
// "DELETED_DOC": Indica que o documento foi excluído com sucesso.
// "ERROR": Indica que ocorreu um erro durante a operação. O payload
// dessa ação carrega a mensagem de erro.

const deleteReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "DELETED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Hook useDeleteDocument: Este é o hook personalizado principal que será
// utilizado pelos componentes da aplicação. Ele recebe o nome da coleção
// onde os documentos serão excluídos como argumento. no caso o "posts"

export const useDeleteDocument = (docCollection) => {
  // Inicialização do estado e dispatcher: const [response, dispatch] =
  // useReducer(deleteReducer, initialState); cria o estado utilizando
  // useReducer. response irá conter o estado atual e dispatch será utilizado
  //  para disparar ações para atualizar esse estado.

  const [response, dispatch] = useReducer(deleteReducer, initialState);

  const [cancelled, setCancelled] = useState(false);

  //   Cancelamento da operação: O estado cancelled e a função setCancelled
  //   são utilizados para verificar se a operação de exclusão foi cancelada
  //   antes de despachar uma ação. Isso é útil para lidar com casos em que um
  //   componente é desmontado antes que uma operação assíncrona seja concluída,
  //   evitando potenciais efeitos colaterais.

  // Função checkCancelBeforeDispatch: Esta função verifica se a
  // operação foi cancelada antes de despachar uma ação de atualização de estado.

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const deleteDocument = async (id) => {
    checkCancelBeforeDispatch({ type: "LOADING" });

    // Função deleteDocument: Esta função é responsável por excluir o
    // documento da coleção especificada. Ela despacha a ação "LOADING"
    // para indicar que a operação está em andamento, em seguida, tenta
    // excluir o documento. Se a operação for bem-sucedida, ela despacha a
    // ação "DELETED_DOC", caso contrário, despacha a ação "ERROR" com a mensagem
    // de erro correspondente.

    try {
      const deletedDocument = await deleteDoc(doc(db, docCollection, id));

      checkCancelBeforeDispatch({
        type: "DELETED",
        payload: deletedDocument,
      });
    } catch (error) {
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
    }
  };

  return { deleteDocument, response };

  //   Em resumo, este hook personalizado useDeleteDocument
  //   encapsula a lógica de exclusão de documentos Firestore,
  //   gerenciando o estado relacionado à operação para uma melhor
  //    modularidade e reusabilidade em diferentes componentes da aplicação.
};
