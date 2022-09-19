import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Player } from '../../types/Player';
import MicrophoneIcon from '../Icons/MicrophoneIcon';
import SettingsIcon from '../Icons/SettingsIcon';
import { HandleVoiceCommands } from './HandleVoiceCommands';

interface ScoreCardProps {
  players: { playerOne: Player; playerTwo: Player };
  setPlayers: React.Dispatch<
    React.SetStateAction<{
      playerOne: Player;
      playerTwo: Player;
    }>
  >;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScoreCard = ({ players: { playerOne, playerTwo }, setPlayers, setSettingsOpen }: ScoreCardProps) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const changePoints = (player: 'one' | 'two' | 'reset', options: { add: boolean }) => {
    if (player === 'one') {
      if (!options.add && playerOne.score <= 0) {
        throw new Error('Negative score');
      }
      setPlayers((prev) => {
        return {
          ...prev,
          playerOne: {
            name: prev.playerOne.name,
            score: options.add ? prev.playerOne.score + 1 : prev.playerOne.score - 1
          }
        };
      });
    } else if (player === 'two') {
      if (!options.add && playerTwo.score <= 0) {
        throw new Error('Negative score');
      }
      setPlayers((prev) => {
        return {
          ...prev,
          playerTwo: {
            name: prev.playerTwo.name,
            score: options.add ? prev.playerTwo.score + 1 : prev.playerOne.score - 1
          }
        };
      });
    } else if (player === 'reset') {
      setPlayers((prev) => {
        return {
          playerOne: {
            name: prev.playerOne.name,
            score: 0
          },
          playerTwo: {
            name: prev.playerTwo.name,
            score: 0
          }
        };
      });
    }
  };

  useEffect(() => {
    HandleVoiceCommands(transcript, resetTranscript, playerOne, playerTwo, changePoints);
  }, [transcript]);

  return (
    <div className="bg-white rounded-xl w-96 pb-8">
      <div className="flex justify-between p-4 align-center">
        <MicrophoneIcon listening={listening} />
        <SettingsIcon cb={() => setSettingsOpen(true)} />
      </div>
      <div className="flex flex-col items-center justify-center h-full px-8">
        <div className="flex items-center justify-around w-full">
          <div className="flex flex-col items-center">
            <span className="text-7xl">{playerOne.score}</span>
            <span className="text-2xl pt-2">{playerOne.name.toUpperCase()}</span>
          </div>
          <span className="text-7xl pb-2">:</span>
          <div className="flex flex-col items-center">
            <span className="text-7xl">{playerTwo.score}</span>
            <span className="text-2xl pt-2">{playerTwo.name.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex gap-4 pt-16 items-center">
          <button
            className={` text-white font-bold py-2 px-4 rounded transition-colors ${
              listening ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
            }`}
            onClick={() =>
              SpeechRecognition.startListening({
                continuous: true,
                language: 'pl'
              })
            }
            disabled={listening}
          >
            Start
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            onClick={() => SpeechRecognition.stopListening()}
          >
            Stop
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            onClick={() => {
              resetTranscript();
              changePoints('reset', { add: true });
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
