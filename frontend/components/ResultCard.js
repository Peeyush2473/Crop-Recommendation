import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResultCard({ crop }) {
    if (!crop) return null;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#fff', '#f0f9ff']}
                style={styles.card}
            >
                <Text style={styles.label}>Recommended Crop</Text>
                <Text style={styles.cropName}>{crop.toUpperCase()}</Text>
                <Text style={styles.subtitle}>Best suitable for your soil conditions</Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        width: '100%',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    label: {
        fontSize: 14,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
    },
    cropName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2e7d32', // Green shade
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
    }
});
