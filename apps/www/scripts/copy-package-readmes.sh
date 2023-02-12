#!/bin/bash

set -e

create_frontmatter() {
	NAME="${1}"

	echo "---"
	echo "layout: ../../../layouts/DocsLayout.astro"
	echo "section: Packages"
	echo "title: \"@astro-aws/${NAME}\""
	echo "---"
	echo ""
}

create_more() {
	echo "## More"
	echo ""
	echo "For more information, see the [documentation website](https://astro-aws.org/)"
}

copy_readme() {
	NAME="${1}"

	README_FILE="../../packages/${NAME}/README.md"
	DOCS_FILE="./src/pages/docs/packages/${NAME}.md"

	if [ -f "${README_FILE}" ]; then
		echo "Copying README for ${NAME}..."

		create_frontmatter "${NAME}" > "${DOCS_FILE}"
		cat "${README_FILE}" >> "${DOCS_FILE}"
		create_more >> "${DOCS_FILE}"
	fi
}

mkdir -p src/pages/docs/packages

copy_readme "adapter"
copy_readme "constructs"
