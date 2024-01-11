import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, ImageBackground, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { StatusBar } from 'expo-status-bar';
import Modal from 'react-native-modal';
import { createGame } from 'hunting-words';
import randomcolor from 'randomcolor';
import styles from './style';
import {scale} from 'react-native-size-matters';
import MoedasComponent from '../../../../../components/storage';
import NiveisPro from '../../../../../components/storageNivelPro';

import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

<<<<<<< Updated upstream
const CELL_SIZE = Math.floor(218 * 0.1);
=======
const CELL_SIZE = Math.floor(240 * 0.1);
>>>>>>> Stashed changes
const CELL_PADDING = Math.floor(CELL_SIZE * 0.1);

const Cell = React.memo(({ letter, selected }) => (
  <View style={[styles.cell, letter.isSelected && styles.selected, selected && styles.selected]}>
    <Text style={styles.cellText}>{letter.letter}</Text>
  </View>
));


export default function AlimentosPro({ navigation, rows = 12, cols = 12 }) {
  const { 
    alimentos, 
    addAlimento,
  } = NiveisPro();

  const [palavras, setPalavras] = useState([]);
  const [board, setBoard] = useState({
    game: new createGame(11, 11, []),
  });
  const [cores, setCores] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [numDicasUsadas, setNumDicasUsadas] = useState(0);
  const [hintsExhausted, setHintsExhausted] = useState(false);
  const [columns, setColumns] = useState([]);
  const { moedas, adicionarMoedas } = MoedasComponent();
  const [moedasGanhas, setMoedasGanhas] = useState(0);
  const [currentCell, setCurrentCell] = useState(null);

  const isMountedRef = useRef(true);

  const selectRandomWords = (totalWords, numWords) => {
    const selectedWords = [];
    const allWords = [...totalWords];

    while (selectedWords.length < numWords && allWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * allWords.length);
      selectedWords.push(allWords.splice(randomIndex, 1)[0]);
    }

    return selectedWords;
  };

  const mostrarDica = () => {
    if (numDicasUsadas < 5) {
      const palavrasNaoEncontradas = palavras.filter((palavra) => !palavra.found);
  
      if (palavrasNaoEncontradas.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * palavrasNaoEncontradas.length);
        const palavraAleatoria = palavrasNaoEncontradas[indiceAleatorio];
        const novoTabuleiro = { ...board.game };
        const novasPalavras = [...palavras];

        // seleciona as letras correspondentes à palavra aleatória
        columns.forEach((column) => {
          if (column.word[0] === palavraAleatoria.name) {
            let row = column.row;
            let col = column.column;
            setCurrentCell({ row, col });
            novoTabuleiro.board[column.row][column.column].setIsSelected(true);
            if (!isCellSelected(row, col)) {
              setSelectedCells(prevCells => [...prevCells, { row, col }]);
            }
          }
        });
  
        // atualiza a state do board
        setBoard({ game: novoTabuleiro });
  
        // muda o fundo da palavra encontrada
        novasPalavras.forEach((palavra) => {
          if (palavra.name === palavraAleatoria.name) {
            palavra.found = true;
          }
        });
  
        // atualiza a state de palavras apenas se houve alterações
        setPalavras([...novasPalavras]);
        userWin();
        setNumDicasUsadas(numDicasUsadas + 1);
      } else {
        setHintsExhausted(true);
      }
    } else {
      setHintsExhausted(true);
    }
  };

  const fecharModalDicasEsgotadas = () => {
    setHintsExhausted(false);
  };

  const buildColumnsArray = () => {
    const columnsArray = [];
    board.game.board.forEach((row) => {
      row.forEach((column) => {
        columnsArray.push(column);
      });
    });
    setColumns(columnsArray);
  };

  useEffect(() => {
    buildColumnsArray();
  }, [board.game]); 

  const fetchData = () => {
    const palavrasOriginais = [
      {name: 'PERU', found: false },
      {name: 'PANETONE', found: false },
      {name: 'CHESTER', found: false },
      {name: 'RABANADA', found: false },
      {name: 'BACALHAU', found: false },
      {name: 'VINHO', found: false },
      {name: 'FAROFA', found: false },
      {name: 'CEIA', found: false },
      {name: 'FRUTAS', found: false },
      { name: 'BOLINHO', found: false },
      { name: 'NOZES', found: false },
      { name: 'GELEIA', found: false },
      { name: 'LEITE', found: false },
      { name: 'COCO', found: false },
      { name: 'DOCE', found: false },
      { name: 'GANSO', found: false },
      { name: 'MAÇA', found: false },
      { name: 'MESSA', found: false },
      { name: 'MINGAU', found: false },
      { name: 'PUDIM', found: false },
      { name: 'SALSA', found: false },
      { name: 'SORVETE', found: false },
      { name: 'TORTA', found: false },
      { name: 'PASSAS', found: false },
    ];

  if (isMountedRef.current) {
    const palavrasEscolhidas = selectRandomWords(palavrasOriginais, 9);
  setPalavras(palavrasEscolhidas);

  const palavrasJogo = palavrasEscolhidas.map((palavra) => palavra.name);
  setBoard({ game: new createGame(11, 11, palavrasJogo) });

  const coresAleatorias = palavrasEscolhidas.map(() => randomcolor());
  setCores(coresAleatorias);

  setStartTime(new Date());
  setModalVisible(false);
  setTempoDecorrido(0);
  }
  };

  useEffect(() => {
    fetchData();

    return () => {
      isMountedRef.current = false;
    } 
  }, []);


  function userWin() {
    const isWin = palavras.every((palavra) => palavra.found === true);

    if (isWin) {
      mostrarResultado();
    }
  }

  const mostrarResultado = () => {
    const endTime = new Date();
    const tempoDecorrido = (endTime - startTime) / 1000;  
  
    const minutos = Math.floor(tempoDecorrido / 60);
    const segundos = Math.floor(tempoDecorrido % 60);
  
    const tempoFormatado = `${minutos} min ${segundos} seg`;

    adicionarMoedas(86);
    setMoedasGanhas(86);

    let level = parseInt(alimentos) + 1;
    if (alimentos < 30) addAlimento(level.toString());
  
    setModalVisible(true);
    setTempoDecorrido(tempoFormatado);
  };

  const reiniciarJogo = () => {
    const palavrasOriginais = [
      {name: 'PERU', found: false },
      {name: 'PANETONE', found: false },
      {name: 'CHESTER', found: false },
      {name: 'RABANADA', found: false },
      {name: 'BACALHAU', found: false },
      {name: 'VINHO', found: false },
      {name: 'FAROFA', found: false },
      {name: 'CEIA', found: false },
      {name: 'FRUTAS', found: false },
      { name: 'BOLINHO', found: false },
      { name: 'NOZES', found: false },
      { name: 'GELEIA', found: false },
      { name: 'LEITE', found: false },
      { name: 'COCO', found: false },
      { name: 'DOCE', found: false },
      { name: 'GANSO', found: false },
      { name: 'MAÇA', found: false },
      { name: 'MESSA', found: false },
      { name: 'MINGAU', found: false },
      { name: 'PUDIM', found: false },
      { name: 'SALSA', found: false },
      { name: 'SORVETE', found: false },
      { name: 'TORTA', found: false },
      { name: 'PASSAS', found: false },
    ];

    const palavrasEscolhidas = selectRandomWords(palavrasOriginais, 9);
    setPalavras(palavrasEscolhidas);

    const palavrasJogo = palavrasEscolhidas.map((palavra) => palavra.name);
    setBoard({ game: new createGame(11, 11, palavrasJogo) });

    const coresAleatorias = palavrasEscolhidas.map(() => randomcolor());
    setCores(coresAleatorias);

 
    setStartTime(new Date());
    setModalVisible(false);
    setTempoDecorrido(0);
    setNumDicasUsadas(0);
    setHintsExhausted(false);
    setColumns([]);
    setCurrentCell(null);
    setSelectedCells([]);

  };

  const closeModal = () => {
    reiniciarJogo();
  };

  const [selectedCells, setSelectedCells] = useState([]);
const panRef = useRef(null);

const isCellSelected = useCallback(
  (row, col) => selectedCells.some(cell => cell.row === row && cell.col === col),
  [selectedCells]
);

const onGestureEvent = (event) => {
  const { x, y } = event.nativeEvent;
  const row = Math.floor(y / scale(CELL_SIZE));
  const col = Math.floor(x / scale(CELL_SIZE));
  if (row >= 0 && col >= 0 && row < rows && col < cols && (currentCell?.row !== row || currentCell?.col !== col)) {
    setCurrentCell({ row, col });
    if (!isCellSelected(row, col)) {
      setSelectedCells(prevCells => [...prevCells, { row, col }]);
    }
  }
};

const onHandlerStateChange = (event, item) => {
  let letterSelected = '';

  if (event.nativeEvent.state === State.END) {
    selectedCells.forEach((cell) => {
      board.game.board.forEach((row) => {
        row.forEach((letter) => {
          if (cell.col === letter.column && cell.row === letter.row) {
            letterSelected += letter.letter;
          }
        })
      })
    });

    let game = board.game;
    game.board.forEach((row) => {
      row.forEach((column) => {
        if (!column.isSelected) {
          if (column.word[0] === letterSelected) {
            game.board[column.row][column.column].setIsSelected(true);
          }
        }
      });
    });

    setBoard({ game });
    setSelectedCells([]);
    setCurrentCell(null);
    

    palavras.forEach((palavra) => {
      if (palavra.name === letterSelected) {
        palavra.found = true;
      }
    });

    setPalavras([...palavras]);

    userWin();
  }
};



  return (
    <View style={styles.container}>
      <ImageBackground source={require('./../../../../../assets/templatejogo.jpg')} style={styles.imageBackground}>
        
      <TouchableOpacity onPress={mostrarDica}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ImageBackground
            source={require('./../../../../../assets/chapeu.png')}
            style={styles.Dica}
          >
            <Text style={styles.dicaNumber}>{5 - numDicasUsadas}</Text>
          </ImageBackground>
        </View>
      </TouchableOpacity>

      <View style={styles.moedasContainer}>
        <View style={styles.IconMoeda}></View>
        <Text style={styles.moedasText}>{moedas}</Text>
      </View>


          <Ionicons style={styles.button} name="arrow-back" size={scale(40)} color="white"
            onPress={() => navigation.navigate('NivelPro')} />

        <View style={styles.palavrasContainer}>
          {
            palavras.map((palavra, index) => (
              <Text key={index} style={[
                styles.palavras,
                (palavra.found) ? { backgroundColor: cores[index] } : null,
                (palavra.found) ? styles.wordFound : null,
              ]}>
                {palavra.name}
              </Text>
            ))
          }
        </View>
        <View style={styles.cacaContainer}>
          <ImageBackground
          source={require('./../../../../../assets/telaingameretangulo.png')}
          style={styles.retangulo}
        >
          
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
              ref={panRef}
            >
              <View style={styles.LetterContainer}>
              {
                board.game.board.map((row, indexRow) => (
                  <View key={indexRow} style={styles.row}>
                    {
                      row.map((letter, colIndex) => (
                        <Cell 
                          key={`cell-${indexRow}-${colIndex}`} 
                          letter={letter} 
                          selected={isCellSelected(indexRow, colIndex)} 
                        />
                      ))
                    }
                  </View>
                ))
              }
              </View>
            </PanGestureHandler>
          </GestureHandlerRootView>
        </ImageBackground>
        </View>

        <Modal isVisible={hintsExhausted} onBackdropPress={fecharModalDicasEsgotadas} style={styles.modalContainer2}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            As dicas acabaram!
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={fecharModalDicasEsgotadas}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isModalVisible} onBackdropPress={closeModal} style={styles.modalContainer2}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>TEMPO:</Text>
          <Text style={styles.textTempo}>{tempoDecorrido}s</Text>
          <Text>Moedas ganhas nesta partida: {moedasGanhas}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Continuar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.modalButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

        <StatusBar style="auto" />
      </ImageBackground>
    </View>
  );
}