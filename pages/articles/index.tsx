import Card from "../../assets/components/Card";
import CardList from "../../assets/components/CardList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRss } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { articlesBuildPath, getBuildPaths, getFileName, getFrontMatter, getSlug, getWebPath } from "../../assets/scripts/paths";

export default function Articles({ articles }) {
	return (
		<>
			<h1>Articles <Link href="/rss.xml"><a><FontAwesomeIcon icon={faRss} /></a></Link></h1>
			<CardList>
				{articles.sort((a, b) => new Date(a.frontMatter.date ?? 0) > new Date(b.frontMatter.date ?? 0) ? -1 : 1).map((article) =>
					<Card href={article.webPath} key={article.slug}>
						<h2>{article.frontMatter.title ?? "Untitled Article"}</h2>
						<p>{article.frontMatter.description ?? "No description."}</p>
					</Card>
				)}
			</CardList>
		</>
	);
}

export async function getStaticProps() {
	const articleBuildPaths = (await getBuildPaths(`${articlesBuildPath}/*`))
		.filter((buildPath) => /\.mdx?$/.test(buildPath));

	const articles = await Promise.all(articleBuildPaths.map(async (buildPath) => {
		const webPath = getWebPath(buildPath);
		const fileName = getFileName(buildPath);
		const slug = getSlug(fileName);
		const frontMatter = await getFrontMatter(buildPath);

		return {
			webPath,
			fileName,
			slug,
			frontMatter
		};
	}));

	return {
		props: {
			title: "Articles",
			description: "A list of articles that I've written.",
			articles
		}
	};
}