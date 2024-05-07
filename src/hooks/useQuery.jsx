import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

// Este código define um custom hook chamado useQuery, que é utilizado para obter e
// manipular os parâmetros de consulta (query parameters) de uma URL.

// Importações: O código importa useLocation do React Router DOM para obter a
// localização atual da URL e useMemo do React para memoizar o resultado da operação.
// Hook useQuery: Este hook utiliza useLocation para obter o objeto de localização atual,
// que inclui informações sobre a URL, como os parâmetros de consulta. Em seguida, utiliza
// useMemo para memoizar o resultado da operação, garantindo que a instanciação do objeto
// URLSearchParams só ocorra quando o valor de search (a parte da URL após o "?" que contém
// os parâmetros de consulta) mudar.
// Retorno do Hook: O hook retorna uma instância de URLSearchParams, que é um objeto que
// permite acessar e manipular os parâmetros de consulta da URL. Isso permite que o componente
//  que está utilizando o hook obtenha e utilize os parâmetros de consulta da URL de forma
//  eficiente.
