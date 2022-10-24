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

copy_readme() {
	NAME="${1}"

	README_FILE="../../packages/astro-aws-${NAME}/README.md"
	DOCS_FILE="./src/pages/docs/packages/${NAME}.md"

	if [ -f "${README_FILE}" ]; then
		echo "Copying README for ${NAME}..."

		create_frontmatter "${NAME}" > "${DOCS_FILE}"
		cat "${README_FILE}" >> "${DOCS_FILE}"
	fi
}

copy_readme "adapter"
