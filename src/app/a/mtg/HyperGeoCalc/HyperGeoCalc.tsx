"use client";

import {
	type ChangeEvent,
	type Dispatch,
	type JSX,
	type SetStateAction,
	useEffect,
	useState
} from "react";
import { hypergeometricPmf, summation } from "@lakuna/umath";
import multiclass from "util/multiclass";
import style from "./hyper-geo-calc.module.scss";

const onChange =
	(setter: Dispatch<SetStateAction<number>>) =>
	(event: ChangeEvent<HTMLInputElement>) => {
		setter(parseInt(event.target.value, 10) || 0);
	};

export type HyperGeoCalcProps = Omit<JSX.IntrinsicElements["form"], "children">;

export default function HyperGeoCalc({
	className,
	...props
}: HyperGeoCalcProps): JSX.Element {
	const [N, setN] = useState(60);
	const [K, setK] = useState(4);
	const [n, setn] = useState(7);
	const [k, setk] = useState(1);

	const [e, sete] = useState(0);
	const [lt, setlt] = useState(0);
	const [gt, setgt] = useState(0);

	useEffect(() => {
		const eOut = hypergeometricPmf(N, K, n, k);
		const ltOut = summation(0, k - 1, (k2) => hypergeometricPmf(N, K, n, k2));
		const gtOut = summation(k + 1, K, (k2) => hypergeometricPmf(N, K, n, k2));

		sete(eOut);
		setlt(ltOut);
		setgt(gtOut);
	}, [N, K, n, k]);

	return (
		<form className={multiclass(style["hyper-geo-calc"], className)} {...props}>
			<p>
				<label>
					{"Cards in deck:"}
					<input type="number" name="N" value={N} onChange={onChange(setN)} />
				</label>
			</p>
			<p>
				<label>
					{"Copies of [card] in deck:"}
					<input type="number" name="K" value={K} onChange={onChange(setK)} />
				</label>
			</p>
			<p>
				<label>
					{"Cards drawn:"}
					<input type="number" name="n" value={n} onChange={onChange(setn)} />
				</label>
			</p>
			<p>
				<label>
					{"Preferred copies of [card] drawn:"}
					<input type="number" name="k" value={k} onChange={onChange(setk)} />
				</label>
			</p>
			<p>
				<label>
					{`Chance to draw less than ${k.toString()} [card]s:`}
					<output name="lt">{`~${(lt * 100).toFixed(2)}%`}</output>
				</label>
			</p>
			<p>
				<label>
					{`Chance to draw at most ${k.toString()} [card]s:`}
					<output name="lte">{`~${((lt + e) * 100).toFixed(2)}%`}</output>
				</label>
			</p>
			<p>
				<label>
					{`Chance to draw exactly ${k.toString()} [card]s:`}
					<output name="e">{`~${(e * 100).toFixed(2)}%`}</output>
				</label>
			</p>
			<p>
				<label>
					{`Chance to draw at least ${k.toString()} [card]s:`}
					<output name="gte">{`~${((gt + e) * 100).toFixed(2)}%`}</output>
				</label>
			</p>
			<p>
				<label>
					{`Chance to draw more than ${k.toString()} [card]s:`}
					<output name="gt">{`~${(gt * 100).toFixed(2)}%`}</output>
				</label>
			</p>
		</form>
	);
}
