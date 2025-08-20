import React, { useContext, useEffect, useState } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';
import { AuthContext } from '@/contexts/AuthContext';
import { HomeIndividual } from '../Home/TypesUsers/HomeIndividual';
import { HomeCompany } from '../Home/TypesUsers/HomeCompany';
import decode from "jwt-decode";
import { parseCookies } from 'nookies';
import { HomeAdmin } from './TypesUsers/HomeAdmin';

interface DecodedToken {
    accessLevel: string;
    isAdmin: boolean;
}
export function Home() {
    const [admin, setAdmin] = useState(false); 
    const [ typeUser, setTypeUser ] = useState("");
    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies["token.token"];

        if (token) {
            try {
                const decoded = decode<DecodedToken>(token);

                if (decoded.accessLevel) {
                    setTypeUser(decoded.accessLevel);
                    setAdmin(decoded.isAdmin);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

  return (
    <>
      {typeUser === 'individual' && !admin && <HomeIndividual />}
      {typeUser === 'individual' && admin && <HomeAdmin />}
      {typeUser === 'company' && <HomeCompany />}
    </>
  );
}