import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
   title: string;
   members: string;
   thumbnail: string;
   duration: number;
   durationAsString: string;
   url: string;
}

type PlayerContextData = {
   episodeList: Episode[];
   currentEpisodeIndex: number;
   isPlaying: boolean;
   play: (episode: Episode) => void;
   playList: (list: Episode[], index: number) => void;
   togglePlay: () => void;
   setPlayingState: (state: boolean) => void;
   playNext: () => void;
   playPrevious: () => void;
   hasNext: boolean;
   hasPrevious: boolean;
   isLooping: boolean;
   toggleLoop: () => void;
   isShuffling: boolean;
   toggleShuffle: () => void;
   clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
   children: ReactNode,
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
   const [episodeList, setEpisodeList] = useState([]);
   const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
   const [isPlaying, setIsPlaying] = useState(false);
   const [isLooping, setIsLooping] = useState(false);
   const [isShuffling, setIsShuffling] = useState(false);

   function play(episode: Episode) {
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
   }

   function playList(list: Episode[], index: number) {
      setEpisodeList(list);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
   }

   function toggleShuffle() {
      setIsShuffling(!isShuffling);
   }

   function toggleLoop() {
      setIsLooping(!isLooping);
   }

   function togglePlay() {
      setIsPlaying(!isPlaying);
   }

   function setPlayingState(state: boolean) {
      setIsPlaying(state);
   }

   const hasPrevious = currentEpisodeIndex > 0;
   const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

   function playNext() {
      if(isShuffling) {
         const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
         setCurrentEpisodeIndex(nextRandomEpisodeIndex);
      } else if(hasNext) {
         setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
   }

   function playPrevious() {
      if(hasPrevious) {
         setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
   }

   function clearPlayerState() {
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
   }

   return (
      <PlayerContext.Provider 
         value={{ 
            episodeList, 
            currentEpisodeIndex, 
            play,
            playList,
            isPlaying, 
            togglePlay, 
            setPlayingState,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            isLooping,
            toggleLoop,
            isShuffling,
            toggleShuffle,
            clearPlayerState,
         }}>
         {children}
      </PlayerContext.Provider>
   )
}

export const usePlayer = () => {
   return useContext(PlayerContext);
}