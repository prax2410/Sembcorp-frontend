import { useState, useEffect } from 'react';
import { API } from '../../config';

function useFetchWegid() {
    const [listOfMachines, setListOfMachines] = useState([]);

    useEffect(() => {
        async function fetchWegid() {
            try {
                const response = await fetch(`${API}/fetchWegid`);
                const result = await response.json();
                const data = result.listOfWegid;
                if (data !== []) {
                    const temp = data.map(machine => {
                        const formattedMachine = machine.replace("-", "");
                        return formattedMachine;
                    });
                    setListOfMachines(temp);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchWegid();
    }, [API]);

    return listOfMachines;
}

export default useFetchWegid;
