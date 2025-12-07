# Continue Extension Configuration

This file explains the Continue extension setup for the Waste Management System project.

## What is Continue?

Continue is an open-source AI code assistant that works similar to Cursor AI. It provides:

- **Chat interface** for asking coding questions
- **Inline editing** with AI suggestions
- **Codebase-wide context** for better answers
- **Custom commands** for common tasks (fix, explain, refactor, test, docs, review)
- **Multiple AI provider support** (OpenAI, Anthropic, local models, etc.)

## Installation Steps

1. **Install the Extension**

   - Press `Ctrl+Shift+X` to open Extensions
   - Search for: `Continue`
   - Install "Continue - open-source AI code agent" by Continue

2. **Configure Your API Keys**

   After installation, Continue will create a config file. You can also edit the one we've prepared at:

   `.continue/config.json`

   **To add your API keys:**

   - Open the file: `.continue/config.json`
   - Find the `"apiKey": ""` fields
   - Add your keys:
     ```json
     {
       "title": "GPT-4 (OpenAI)",
       "provider": "openai",
       "model": "gpt-4",
       "apiKey": "sk-your-openai-key-here"
     }
     ```

   **Supported providers:**

   - **OpenAI** (GPT-4, GPT-3.5-turbo): Get key from https://platform.openai.com/api-keys
   - **Anthropic** (Claude 3.5 Sonnet): Get key from https://console.anthropic.com/
   - **Free alternatives**: You can also use local models with Ollama (no API key needed)

3. **Using Continue**

   Once installed and configured:

   - **Open Chat**: Press `Ctrl+L` or click Continue icon in sidebar
   - **Select Code & Ask**: Highlight code, press `Ctrl+L`, ask a question
   - **Edit Code**: Select code, type `/edit` in Continue chat, describe the change
   - **Custom Commands**: Type `/fix`, `/explain`, `/refactor`, `/test`, `/docs`, `/review`

## Pre-configured Features

The config file includes:

### Custom Commands

- `/fix` - Fix bugs in selected code
- `/explain` - Get detailed code explanations
- `/refactor` - Improve code quality
- `/test` - Generate unit tests
- `/docs` - Create JSDoc documentation
- `/review` - Perform code reviews

### Context Providers

Continue will automatically use:

- Current file code
- Open files in editor
- Git diffs
- Terminal output
- VS Code problems/errors
- Entire codebase (with `@codebase` mention)

### Documentation Links

Quick access to:

- React, Node.js, Express, MongoDB, Mongoose docs

## Alternative: Use Without API Keys

If you don't want to pay for API access:

1. **Install Ollama** (free, runs locally)

   - Download from: https://ollama.ai/
   - Install a model: `ollama pull codellama`

2. **Update Continue config** to use Ollama:
   ```json
   {
     "models": [
       {
         "title": "CodeLlama (Local)",
         "provider": "ollama",
         "model": "codellama",
         "apiBase": "http://localhost:11434"
       }
     ]
   }
   ```

## Workflow Example

1. **Working on a feature?**

   - Select the relevant code
   - Press `Ctrl+L`
   - Ask: "How can I add error handling here?"

2. **Need to refactor?**

   - Select the messy code
   - Type: `/refactor`
   - Continue will suggest improvements

3. **Writing tests?**

   - Select the function
   - Type: `/test`
   - Get complete test cases

4. **Multi-file changes?**
   - Open Continue chat
   - Ask: "Update the notification system to support email delivery across all relevant files"
   - Continue will propose changes to multiple files

## Tips

- Use `@codebase` in chat to ask questions about the entire project
- Use `@file` to reference specific files
- Use `@terminal` to include terminal output in context
- Use `@problems` to include VS Code errors/warnings

## Troubleshooting

**Continue not starting?**

- Check if you have an API key configured
- Try reloading VS Code: `Ctrl+Shift+P` → "Reload Window"

**Not getting good suggestions?**

- Make sure you're using a capable model (GPT-4 or Claude 3.5 recommended)
- Provide more context with `@codebase` or select more code

**Want to switch models?**

- Click the model name in Continue chat
- Select a different configured model

---

**Next Steps:**

1. Install Continue extension: `Ctrl+Shift+X` → Search "Continue"
2. Add your API key to `.continue/config.json`
3. Press `Ctrl+L` to start chatting!
