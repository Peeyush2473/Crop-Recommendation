import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import InputParams from './components/InputParams';
import GradientButton from './components/GradientButton';
import ResultCard from './components/ResultCard';

export default function App() {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handlePredict = async () => {
    // Basic validation
    if (Object.values(formData).some(val => val === '')) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://192.168.1.6:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.crop);
      } else {
        Alert.alert('Error', data.error || 'Failed to predict');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to backend. Ensure server is running.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#e0f7fa', '#e8f5e9']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="dark" />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

              <View style={styles.header}>
                <Text style={styles.title}>Crop Recommender</Text>
                <Text style={styles.subtitle}>Find the perfect crop for your soil</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.row}>
                  <InputParams label="Nitrogen (N)" value={formData.N} onChangeText={(t) => handleInputChange('N', t)} placeholder="e.g. 90" />
                  <InputParams label="Phosphorus (P)" value={formData.P} onChangeText={(t) => handleInputChange('P', t)} placeholder="e.g. 42" />
                </View>

                <View style={styles.row}>
                  <InputParams label="Potassium (K)" value={formData.K} onChangeText={(t) => handleInputChange('K', t)} placeholder="e.g. 43" />
                  <InputParams label="Temperature (°C)" value={formData.temperature} onChangeText={(t) => handleInputChange('temperature', t)} placeholder="e.g. 20" />
                </View>

                <View style={styles.row}>
                  <InputParams label="Humidity (%)" value={formData.humidity} onChangeText={(t) => handleInputChange('humidity', t)} placeholder="e.g. 82" />
                  <InputParams label="pH Level" value={formData.ph} onChangeText={(t) => handleInputChange('ph', t)} placeholder="e.g. 6.5" />
                </View>

                <View style={styles.row}>
                  <InputParams label="Rainfall (mm)" value={formData.rainfall} onChangeText={(t) => handleInputChange('rainfall', t)} placeholder="e.g. 200" />
                </View>

                <GradientButton
                  title={loading ? "Analyzing..." : "Predict Crop"}
                  onPress={handlePredict}
                  disabled={loading}
                  colors={['#2e7d32', '#43a047']}
                />
              </View>

              <ResultCard crop={result} />

            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <View>
        </View>
      </LinearGradient>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1b5e20',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
});
