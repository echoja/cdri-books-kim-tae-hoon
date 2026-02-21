function getColumnLength(line) {
  return Array.from(line).length;
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce max line length for one-line className string attributes",
    },
    schema: [
      {
        type: "object",
        properties: {
          max: {
            type: "integer",
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      tooLong:
        "className=\"...\" line is {{actual}} columns (max {{max}}). Split classes with cn(\"...\", \"...\").",
    },
  },
  create(context) {
    const options = context.options[0] ?? {};
    const max = Number.isInteger(options.max) ? options.max : 120;
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    return {
      JSXAttribute(node) {
        if (node.name?.type !== "JSXIdentifier" || node.name.name !== "className") {
          return;
        }

        if (!node.value || node.value.type !== "Literal" || typeof node.value.value !== "string") {
          return;
        }

        if (!node.loc || node.loc.start.line !== node.loc.end.line) {
          return;
        }

        const lineNumber = node.loc.start.line;
        const lineText = sourceCode.lines[lineNumber - 1] ?? "";
        const actual = getColumnLength(lineText);

        if (actual <= max) {
          return;
        }

        context.report({
          node,
          messageId: "tooLong",
          data: {
            actual: String(actual),
            max: String(max),
          },
        });
      },
    };
  },
};
