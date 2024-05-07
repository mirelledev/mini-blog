import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

//no useFetchDocuments a gente tem esses 3 parametros
//o docCollection, o search e o uid

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (cancelled) return;

      setLoading(true);

      //basicamente, a gente faz uma collectioRef
      //onde ela vai pegar o metodo collection do firebase
      //e vai ter como parametro o nosso banco de dados do firebase,
      //e o docCollection, que no caso é "posts" que a gente setou

      const collectionRef = await collection(db, docCollection);

      try {
        let q;
        //oq ele faz eh basicamente
        //se tiver algum parametro de busca
        //la no useFetchDocuments("posts" e tipo serach=search)
        //ele vai pegar os documentos na colecao posts
        //que eh onde todos ficam armazenados
        //baseados no search que a gente passou como parametro
        //ent se ele tiver um search
        //ele vai ir no collectionRef
        //que eh o "posts" e vai na tagsArray

        //ja que a gente setou o metodo de pesquisa como tags

        //ent ele vai la e ve se na array contem o algo
        //parecido como nosos parametro de busca
        //se o search for aa ele vai procurar alguma tag
        //que tenha aa
        //e vai ordernar em qnd foi criador e pela desc

        if (search) {
          q = await query(
            collectionRef,
            where("tagsArray", "array-contains", search),
            orderBy("createdAt", "desc")
          );
        }

        //o else if, se tiver algum parametro como uid
        //ele vai pegar no "posts" somente documentos
        //que tenha essa uid como parametro
        //por exemplo so vai pegar posts que tem a user id
        //da pessoa que fez
        //ai tipo ele vai da um query que eh a busca
        //where (aonde) ai ele vai chegar se o "uid" la no banco
        //de dados é igual ao uid do usuario dado como parametro
        else if (uid) {
          q = await query(
            collectionRef,
            where("uid", "==", uid),
            orderBy("createdAt", "desc")
          );

          //e caso nao tenha nenhum desses, como na home
          //por exemplo
          //ele so vai ordenar por ordem de criaçao e desc
        } else {
          q = await query(collectionRef, orderBy("createdAt", "desc"));
        }

        //esse snapchot eh pra ele dar um snap, tipo ua foto
        //e pegar todos os documentos naquele momento

        //ele vai pegar a info que o Q pegou
        //seja com parametro search, uid ou nada
        //e vai da um snapshot nos documentos

        await onSnapshot(q, (querySnapshot) => {
          setDocuments(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        });

        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadData();
    //como depedencia tem o docColleciton, search, uid e cancelled
    //que como ja vimos eh tipo se algo dessas depedencias mudar
    //ele vai executar a funcao dnv com as info atualizadas
  }, [docCollection, search, uid, cancelled]);

  return { documents, loading, error };
};
