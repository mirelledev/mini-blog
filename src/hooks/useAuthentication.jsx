import { db } from "../firebase/config";
//DATABASE DO FIREBASE

//METODOS DO FIREBASE PRA AUTENTICAÇAO
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

//AUTH DO FIREBASE
import { auth } from "../firebase/config";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
  //CRIAMOS ESSAS CONSTANTES PRA MONITORAR OS ESTADOS DE
  //LOADING E ERROR
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // CUIDAR DA MEMORY LEAK
  const [cancelled, setCancelled] = useState(false);

  //CRIA UM AUTH QUE SERA O getAuth() DO FIREBASE
  const auth = getAuth();

  //FUNCAO PRA CUIDAR DO MEMORY LEAK, CASO FOR CANCELADO
  //ELE NAO CHEGA A FAZER NENHUMA ACAO E RETORNA

  function checkIfIsCancelled() {
    if (cancelled) {
      return;
    }
  }

  //UMA ASYNC FUNCTION PRA CRIAR UM USER QUE ESPERA OS DADOS
  //QUE NO CASO SERA O USER COM AS INFORMAÇÕES
  const createUser = async (data) => {
    //FAZ A FUNCAO PRA CHECKAR SE FOI CANCELADA
    checkIfIsCancelled();
    //LOADING FICA TRUE
    setLoading(true);
    //FAZ UM TRY PQ TODA FUNCAO ONDE DA UM FETCH PODE DAR ERRO
    //ENTAO FAZ UM TRY CATCTH

    try {
      //CRIA UM OBJETO USER ONDE USA O METODO DO FIREBASE
      //createUserWithEmailAndPassword, ONDE PASSA O auth DO FIREBASE
      //que eh o getAuth() E PASSA O DATA.EMAIL E DATA.PASSWORD
      //QUE NO CASO É USER.EMAIL E USER.PASSWORD
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      //ISSO DAQUI É PRA SETAR O NOME!

      await updateProfile(user, {
        displayName: data.displayName,
      });
      //RETORNARA O USER
      return user;
      //CASO DE ERRO ELE MOSTRARA O ERRO NO CONSOLE.LOG
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      //CRIA UMA VARIAVEL SO PRA CONTROLAR AS MENSAGENS
      //QUE APARECE NA TELA
      let systemErrorMessage;

      if (error.message.includes("Password")) {
        systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
      }

      setError(systemErrorMessage);
    }

    setLoading(false);
  };

  //LOGOUT EH SO USAR O METODO signOut(auth) DO FIREBASE!
  const logout = () => {
    checkIfIsCancelled();

    signOut(auth);
  };
  //login - sign in
  const login = async (data) => {
    checkIfIsCancelled();

    setLoading(true);
    setError("");
    //USA METODO signInWithEmailAndPassword DO FIREBASE
    //ONDE PEGARA O EMAIL E PASSWORD DO USER E CHECARA se tem
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(false);
    } catch (error) {
      let systemErrorMessage;

      if (error.message.includes("user-not-found")) {
        systemErrorMessage = "Usuário não encontrado!";
      } else if (error.message.includes("invalid-credential")) {
        systemErrorMessage =
          "Não foi possivel encontrar sua conta, verifique se o E-mail e a senha estão corretos!";
      } else {
        systemErrorMessage = "Ocorreu algum erro, tente novamente mais tarde!";
      }
      setLoading(false);

      setError(systemErrorMessage);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    error,
    logout,
    login,
    loading,
  };
};
