/**
 * Combine multiple potential class names into one string to make class names more readable in JSX.
 * @param classNames - The list of class names. Non-string elements are skipped.
 * @returns A combined class name string.
 * @public
 */
export default function multiclass(...classNames: readonly unknown[]): string {
	return classNames
		.filter((className) => typeof className === "string")
		.join(" ");
}
