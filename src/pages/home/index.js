import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";

const HomePage = () => {
  const [valueText, setValueText] = useState({});
  const [isShowResult, setIsShowResult] = useState(false);
  const [totalProduksi, setTotalProduksi] = useState(0)

  const inputList = [
    {
      key: "permintaan_terbesar",
      name: "Permintaan Terbesar",
      value: valueText.permintaan_terbesar ?? "",
    },
    {
      key: "permintaan_terkecil",
      name: "Permintaan Terkecil",
      value: valueText.permintaan_terkecil ?? "",
    },
    {
      key: "permintaan_diminta",
      name: "Permintaan yang Diminta",
      value: valueText.permintaan_diminta ?? "",
    },
    {
      key: "persediaan_terbesar",
      name: "Persediaan Terbesar",
      value: valueText.persediaan_terbesar ?? "",
    },
    {
      key: "persediaan_terkecil",
      name: "Persediaan Terkecil",
      value: valueText.persediaan_terkecil ?? "",
    },
    {
      key: "persediaan_digudang",
      name: "Persediaan di Gudang",
      value: valueText.persediaan_digudang ?? "",
    },
    {
      key: "produksi_terbesar",
      name: "Produksi Terbesar",
      value: valueText.produksi_terbesar ?? "",
    },
    {
      key: "produksi_terkecil",
      name: "Produksi Terkecil",
      value: valueText.produksi_terkecil ?? "",
    },
  ];

  const onChangeText = (key, text) => {
    setValueText({
      ...valueText,
      [key]: text,
    });
  };
  const textInput = () => {
    let inputan = [];
    inputList.map((input, key) => {
      inputan.push(
        <View style={{ marginBottom: 16 }} key={key}>
          <Text style={{ marginBottom: 4 }}>{input.name}</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              padding: 8,
              borderRadius: 8,
            }}
            keyboardType="number-pad"
            onChangeText={(text) => onChangeText(input.key, text)}
            value={input.value}
          />
        </View>
      );
      return "";
    });
    return inputan;
  };

  const handleHitung = () => {
    setIsShowResult(true)
    let permintaan_turun = 0
    let permintaan_naik = 0
    let persediaan_sedikit = 0
    let persediaan_banyak = 0
    let produksi_berkurang = 0
    let produksi_bertambah = 0
    let alpha_prediksi = [0, 0, 0, 0]
    let z = [0, 0, 0, 0]
    let produksi_harus_dibuat = 0

    permintaan_turun = (valueText.permintaan_terbesar - valueText.permintaan_diminta)/(valueText.permintaan_terbesar-valueText.permintaan_terkecil)
    
    permintaan_naik = (valueText.permintaan_diminta-valueText.permintaan_terkecil)/(valueText.permintaan_terbesar-valueText.permintaan_terkecil)

    persediaan_sedikit = (valueText.persediaan_terbesar-valueText.persediaan_digudang)/(valueText.persediaan_terbesar-valueText.persediaan_terkecil)

    persediaan_banyak = ((valueText.persediaan_digudang-valueText.persediaan_terkecil)/(valueText.persediaan_terbesar-valueText.persediaan_terkecil))

    // mencari alpha prediksi 1 dgn perbandingan pilih paling kecil
    permintaan_turun < persediaan_banyak ? alpha_prediksi[0] = permintaan_turun : alpha_prediksi[0] = persediaan_banyak
    permintaan_turun < persediaan_sedikit ? alpha_prediksi[1] = permintaan_turun : alpha_prediksi[1] = persediaan_sedikit
    permintaan_naik < persediaan_banyak ? alpha_prediksi[2] = permintaan_naik : alpha_prediksi[2] = persediaan_banyak
    permintaan_naik < persediaan_sedikit ? alpha_prediksi[3] = permintaan_naik : alpha_prediksi[3] = persediaan_sedikit

    z[0] = -1*(parseFloat((alpha_prediksi[0]*(valueText.produksi_terbesar-valueText.produksi_terkecil)))-parseFloat(valueText.produksi_terbesar))
    z[1] = -1*((alpha_prediksi[1]*(valueText.produksi_terbesar-valueText.produksi_terkecil))-valueText.produksi_terbesar)
    z[2] = (parseFloat((alpha_prediksi[2]*(valueText.produksi_terbesar-valueText.produksi_terkecil)))+parseFloat(valueText.produksi_terkecil))
    z[3] = (parseFloat((alpha_prediksi[3]*(valueText.produksi_terbesar-valueText.produksi_terkecil)))+parseFloat(valueText.produksi_terkecil))

    produksi_harus_dibuat = (( (alpha_prediksi[0]*z[0]) + (alpha_prediksi[1]*z[1]) + (alpha_prediksi[2]*z[2]) + (alpha_prediksi[3]*z[3]) )/ (parseFloat(alpha_prediksi[0])+parseFloat(alpha_prediksi[1])+parseFloat(alpha_prediksi[2])+parseFloat(alpha_prediksi[3])))
    setTotalProduksi(produksi_harus_dibuat)
  }

  const handleHitungKembali = () => {
    setIsShowResult(false)
  }

  const _result = () => {
    return (
      <View style={{textAlign: 'center'}}>
        <Text>Produksi yang harus dibuat</Text>
        <Text style={{fontSize: 36, color: 'green', margin: 10}}>{Math.ceil(totalProduksi)}</Text>
        <Button title="Hitung Kembali" onPress={handleHitungKembali} />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: 24,
      }}
    >
      {!isShowResult ? (
        <ScrollView style={{ width: "100%" }}>
          {textInput()}
          <Button title="Hitung" onPress={handleHitung} />
        </ScrollView>
      ) : (
        _result()
      )}
    </View>
  );
};

export default HomePage;
