//Bootcamp Desarrollo de Aplicaciones de banca - BANCO BASE
//Hecho por Roger Alejandro Pacheco Yama 

import { IconCoin } from "@tabler/icons-react";
import { Currency, DropdownOrderBy, Header, SearchInput } from "../components";
import { Currency as ICurrency } from "../interfaces";
import { useEffect, useState } from "react";
import { currenciesMock } from "../mocks";

export const Currencies = () => {

	const [currencies, setCurrencies] = useState<ICurrency[]>([]);
	const [currentOrderOption, setcurrentOrderOption] = useState('customerid');
	const currencyOptions: { label: string, value: string }[] = [
		{
			label: "Nombre",
			value: "name",
		},
		{
			label: "Cambio",
			value: "value",
		},
		//Como el simbolo en este ejemploe es unico no tiene sentido agregarlo como filtro.
	]

	//Se renderiza el arreglo mock de currecnies.
	useEffect(() => {
		setCurrencies(currenciesMock);
		setCurrencies((prevState) => orderCurrencies(prevState, currentOrderOption));
	}, []);

	//Esta funcion es para ordenar las monedas en base al cambio (value) y nombre (name)
	const orderCurrencies = (currencies: ICurrency[], currentOrderOption: string): ICurrency[] => {
		let key = currentOrderOption as keyof (typeof currencies)[0];
		const newCurrencies: ICurrency[] = [...currencies].sort((a: ICurrency, b: ICurrency) => {
			if (a[key] > b[key]) return 1;
			if (a[key] < b[key]) return -1;
			return 0;
		});
		return newCurrencies;
	};

	//Logica para dropdown en base a name y value
	const handleDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setcurrentOrderOption(e.target.value);
		setCurrencies(orderCurrencies(currencies, e.target.value));
	}

	//Funcion de busqueda para filtrar el arreglo con los 3 parametros de currecy, value, name, y symbol.
	//No se implementa la validacion de mayusculas y minusculas, toma literal el string del input.
	const handleSearch = (searchWord: string) => {
		if (searchWord === "") {
			//Si no hay nada que devuelva el arreglo completo.
			setCurrencies(currenciesMock);
		} else {
			let newCurrency = currenciesMock.filter((currency) => {
				//Aqui se devuelve los que incluyan al menos la palabra, con esto resolvemos 
				//que no devuelve resultado cuando es una letra o apenas se empieza a escribir en el search.
				if (
					currency.name.toString().includes(searchWord) ||
					currency.value.toString().includes(searchWord) ||
					currency.symbol.toString().includes(searchWord)
				) {
					return currency;
				}

				//Esta es la manera en la que se mostro el ejemplo en la sesion, pero no 
				//se uso por el probelma especificado anteroirmente, ppro se incluye como ejemplo.
				/*
				if (searchWord === currency.name.toString()) {
					return currency;
				}
				if (searchWord === currency.value.toString()) {
					return currency;
				}
				if (searchWord === currency.symbol.toString()) {
					return currency;
				}
				*/
			})
			setCurrencies(newCurrency);
		}
	}

	return (
		<>
			<Header>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Divisas
				</h1>
				<div className="flex sm:w-96 w-full gap-2">
					<DropdownOrderBy
						//Pasamos la logica de la funcion para el dropdown, no elresultado.
						onChange={handleDropdown}
						options={currencyOptions}
						value={currentOrderOption}
					/>
					<SearchInput
						Icon={IconCoin}
						onSearch={(e) => handleSearch(e.target.value)}
						propertie="divisa"
					/>
				</div>
			</Header>

			<section className="flex flex-col items-center h-[calc(100vh-10rem)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<ul
					role="list"
					className="grid w-full gap-3 overflow-auto divide-y divide-gray-100 sm:grid-cols-2 xl:grid-cols-4 my-7"
				>
					{
						//Aqui hacemos el renderizado condicional en caso de que no haya monedas.
						currencies.length === 0 ? (
							<>

								<h2>Ups!:(<br />No hay divisas para mostrar.</h2></>
						)
							: (
								currencies.map((currency) => {
									return (
										<Currency currency={currency} key={currency.symbol} />
									)
								})
							)
					}
				</ul>
			</section>
		</>
	);
};
