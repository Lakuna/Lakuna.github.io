"use client";

import type { JSX } from "react/jsx-runtime";

import { hypergeometricPmf, summation } from "@lakuna/umath";
import {
	type ChangeEvent,
	type Dispatch,
	type SetStateAction,
	useState
} from "react";

import multiclass from "@/util/multiclass";

import style from "./hyper-geo-calc.module.scss";

const onChange =
	(setter: Dispatch<SetStateAction<number>>) =>
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(event: ChangeEvent<HTMLInputElement>): void => {
		setter(parseInt(event.target.value, 10) || 0);
	};

export type HyperGeoCalcProps = Omit<JSX.IntrinsicElements["form"], "children">;

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function HyperGeoCalc({
	className,
	...props
}: HyperGeoCalcProps): JSX.Element {
	const [N, setN] = useState(60);
	const [K, setK] = useState(4);
	const [n, setn] = useState(7);
	const [k, setk] = useState(1);

	const e = hypergeometricPmf(N, K, n, k);
	const lt = summation(0, k - 1, (k2) => hypergeometricPmf(N, K, n, k2));
	const gt = summation(k + 1, K, (k2) => hypergeometricPmf(N, K, n, k2));

	return (
		<form className={multiclass(style["hyper-geo-calc"], className)} {...props}>
			<p>
				<label>
					{"Cards in deck:"}
					<input name="N" onChange={onChange(setN)} type="number" value={N} />
				</label>
			</p>
			<p>
				<label>
					{"Copies of [card] in deck:"}
					<input name="K" onChange={onChange(setK)} type="number" value={K} />
				</label>
			</p>
			<p>
				<label>
					{"Cards drawn:"}
					<input name="n" onChange={onChange(setn)} type="number" value={n} />
				</label>
			</p>
			<p>
				<label>
					{"Preferred copies of [card] drawn:"}
					<input name="k" onChange={onChange(setk)} type="number" value={k} />
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
