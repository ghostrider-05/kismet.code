/**
 * @type {import("../scripts/readme").TemplateFormat}
 */
export default function (name, config) {
    return [
        `# @kismet.ts/${name}`, '',
        ...config.icons.map(icon => `![${icon.alt || ''}](${icon.link})`), '',
        config.description,
        '## Installation', `\`\`\`sh\nnpm install @kismet.ts/${name}\n\`\`\``
    ]
}