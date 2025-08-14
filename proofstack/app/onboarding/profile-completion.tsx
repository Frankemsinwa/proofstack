import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Camera,
  Upload,
  Plus,
  X,
  Linkedin,
  Github,
  Twitter,
  ArrowRight,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

// Mock user data as it's not passed as a prop in the original file structure
const mockUser = {
  role: 'talent', // or 'client'
};

const CompleteProfileScreen = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    skills: [] as string[],
    links: {
      linkedin: '',
      github: '',
      twitter: '',
    },
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (currentSkill.trim() && !profileData.skills.includes(currentSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }));
      setCurrentSkill('');
      Keyboard.dismiss();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log({ ...profileData, avatar });
    router.push('./success');
  };

  const handleAvatarUpload = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const suggestedSkills = [
    'React', 'Node.js', 'TypeScript', 'Python', 'UI/UX Design',
    'Figma', 'Mobile Development', 'Machine Learning', 'DevOps', 'Blockchain',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complete Your Profile</Text>
        <Text style={styles.headerSubtitle}>
          Tell us about yourself to build trust with potential {mockUser.role === 'talent' ? 'clients' : 'talents'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#9B3EFF', '#00D0FF']}
              style={styles.avatarGradient}
            >
              <View style={styles.avatarInner}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatarImage} />
                ) : (
                  <Camera size={32} color="#CCCCCC" />
                )}
              </View>
            </LinearGradient>
            <TouchableOpacity style={styles.uploadButton} onPress={handleAvatarUpload}>
              <Upload size={16} color="#2D014D" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarHelpText}>Upload a professional photo</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#888"
            value={profileData.name}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={mockUser.role === 'talent' ? "Tell us about your expertise and experience..." : "Describe your business and what you're looking for..."}
            placeholderTextColor="#888"
            value={profileData.bio}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{mockUser.role === 'talent' ? 'Skills' : 'Areas of Interest'}</Text>
          <View style={styles.addSkillRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Add a skill..."
              placeholderTextColor="#888"
              value={currentSkill}
              onChangeText={setCurrentSkill}
              onSubmitEditing={handleAddSkill}
            />
            <TouchableOpacity style={styles.addSkillButton} onPress={handleAddSkill}>
              <Plus size={20} color="#2D014D" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.suggestedSkillsContainer}>
            {suggestedSkills.map((skill) => (
              <TouchableOpacity
                key={skill}
                onPress={() => {
                  if (!profileData.skills.includes(skill)) {
                    setProfileData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
                  }
                }}
                style={styles.suggestedSkill}
              >
                <Text style={styles.suggestedSkillText}>{skill}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.selectedSkillsContainer}>
            {profileData.skills.map((skill) => (
              <LinearGradient
                key={skill}
                colors={['rgba(155, 62, 255, 0.2)', 'rgba(0, 208, 255, 0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.selectedSkill}
              >
                <Text style={styles.selectedSkillText}>{skill}</Text>
                <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                  <X size={14} color="#CCCCCC" />
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Social Links (Optional)</Text>
          <View style={styles.socialLinkInput}>
            <Linkedin size={18} color="#CCCCCC" style={styles.socialIcon} />
            <TextInput
              style={styles.input}
              placeholder="LinkedIn profile URL"
              placeholderTextColor="#888"
              value={profileData.links.linkedin}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, links: { ...prev.links, linkedin: text } }))}
            />
          </View>
          <View style={styles.socialLinkInput}>
            <Github size={18} color="#CCCCCC" style={styles.socialIcon} />
            <TextInput
              style={styles.input}
              placeholder="GitHub profile URL"
              placeholderTextColor="#888"
              value={profileData.links.github}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, links: { ...prev.links, github: text } }))}
            />
          </View>
          <View style={styles.socialLinkInput}>
            <Twitter size={18} color="#CCCCCC" style={styles.socialIcon} />
            <TextInput
              style={styles.input}
              placeholder="Twitter profile URL"
              placeholderTextColor="#888"
              value={profileData.links.twitter}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, links: { ...prev.links, twitter: text } }))}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!profileData.name || !profileData.bio || profileData.skills.length === 0}
          style={{ marginTop: 16 }}
        >
          <LinearGradient
            colors={['#9B3EFF', '#00D0FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.submitButton, (!profileData.name || !profileData.bio || profileData.skills.length === 0) && styles.disabledButton]}
          >
            <Text style={styles.submitButtonText}>Save & Continue</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.progressIndicatorContainer}>
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={styles.progressDot} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 24,
    padding: 4,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#2D014D',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    backgroundColor: '#00FFD1',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHelpText: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  addSkillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addSkillButton: {
    width: 40,
    height: 40,
    backgroundColor: '#00FFD1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  suggestedSkill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  suggestedSkillText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  selectedSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 209, 0.3)',
    gap: 8,
  },
  selectedSkillText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  socialLinkInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
  },
  socialIcon: {
    paddingHorizontal: 16,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: '#00FFD1',
  },
});

export default CompleteProfileScreen;