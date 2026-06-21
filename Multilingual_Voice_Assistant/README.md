# EveryLinguaAI 🌟
### Get assistance in languages spoken all over the world 🌍

EveryLinguaAI is a voice assistant application capable of recognizing and responding to spoken commands in multiple languages. It utilizes the Google Speech Recognition API for speech-to-text conversion, Deep Translator for seamless language translation, and leverages OpenAI's GPT models to generate human-like conversational responses.

## Project Structure

The codebase is now split into focused modules for easier maintenance:

- `main.py`: Application entrypoint.
- `voice_assistant.py`: High-level orchestration (wake loop + handoff to conversation).
- `config.py`: Environment-based runtime configuration.
- `assistant_logger.py`: Info/error/debug logging helpers.
- `wakeword.py`: Wake-word normalization and fuzzy matching.
- `speech_io.py`: Microphone selection, calibration, capture, and STT utilities.
- `conversation.py`: Language selection and conversation flow.
- `openai_client.py`: OpenAI chat + text-to-speech API integration.
- `languages.py`: Supported language mapping.
- `audio.py`: Audio playback helpers.

## Features

- **Wake Word Detection**: Activates the assistant using a specific wake word.
- **Multi-Language Support**: Capable of understanding and responding in numerous languages.
- **Conversational AI**: Employs OpenAI's GPT models for generating intelligent responses.
- **Language Switching**: Allows users to switch the assistant's language dynamically.

