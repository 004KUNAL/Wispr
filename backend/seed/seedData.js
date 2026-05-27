const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const GhostIdentity = require('../models/GhostIdentity');
const { Post } = require('../models/Post');
const Community = require('../models/Community');
const Notification = require('../models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wispr';

const identityData = [
  { alias: 'NeonPhantom', color: '#00f5ff', style: 'cyber', bio: 'I exist between the signal and the noise.', reputation: 842 },
  { alias: 'VoidWalker', color: '#bf00ff', style: 'void', bio: 'Nothing is real. Everything is permitted.', reputation: 1250 },
  { alias: 'GlitchGhost', color: '#ff0090', style: 'ghost', bio: 'Error 404: Identity not found.', reputation: 567 },
  { alias: 'ShadowByte', color: '#39ff14', style: 'shadow', bio: 'Lurking in the dark corners of the net.', reputation: 2100 },
  { alias: 'CipherX', color: '#ff6b00', style: 'neon', bio: 'Encrypted thoughts, decoded feelings.', reputation: 320 },
];

const communityData = [
  { name: 'MidnightThoughts', slug: 'midnight-thoughts', description: 'For the thoughts that only come alive at 3 AM.', category: 'thoughts', color: '#bf00ff' },
  { name: 'DigitalConfessions', slug: 'digital-confessions', description: 'Unload your secrets into the void. We listen.', category: 'confessions', color: '#ff0090' },
  { name: 'NeonDreams', slug: 'neon-dreams', description: 'Share your wildest creative visions.', category: 'creativity', color: '#00f5ff' },
  { name: 'GlitchSupport', slug: 'glitch-support', description: 'Anonymous support for when life glitches.', category: 'support', color: '#39ff14' },
  { name: 'VoidGaming', slug: 'void-gaming', description: 'Gaming confessions and hot takes.', category: 'gaming', color: '#ff6b00' },
];

const postData = [
  { title: 'The city never sleeps and neither do I', content: 'Been awake for 36 hours straight. The neon lights outside my window feel more real than my own thoughts. Anyone else feel like the night version of yourself is more honest?', type: 'text', mood: 'numb', tags: ['midnight', 'insomnia', 'thoughts'] },
  { title: '', content: 'I told my therapist I was fine. I told my friends I was fine. I told myself I was fine. The only place I can say I\'m not fine is here. So... I\'m not fine.', type: 'confession', mood: 'sad', tags: ['confession', 'mentalhealth', 'anonymous'] },
  { title: 'Hot take: The internet was better when it was weird', content: 'Remember when the internet was just people making strange little websites about their cats and obscure hobbies? Now it\'s all optimized, monetized, and sanitized. I miss the void.', type: 'text', mood: 'dark', tags: ['internet', 'nostalgia', 'hotake'] },
  { title: 'I quit my job today', content: 'Six figures, corner office, full benefits. Walked out at 2pm on a Tuesday. Never felt more free or more terrified simultaneously. Ask me anything.', type: 'text', mood: 'excited', tags: ['life', 'career', 'freedom'] },
  { title: 'The algorithm knows me better than I know myself', content: 'It recommended me a song I\'ve never heard and I cried for 20 minutes. How does a machine understand loneliness better than people do?', type: 'thought', mood: 'confused', tags: ['ai', 'loneliness', 'music'] },
  { title: '3AM confession', content: 'I still have the first message you sent me saved. Three years later, read receipts on, knowing you\'ll never message again. Digital ghosts are the worst kind.', type: 'confession', mood: 'sad', tags: ['love', 'confession', 'heartbreak'] },
  { title: 'Unpopular opinion thread', content: 'Start your unpopular opinion with 🔥 and let\'s see who gets the most downvotes. Mine: people who say they "don\'t watch TV" are more exhausting than people who only watch TV.', type: 'text', mood: 'happy', tags: ['unpopularopinion', 'discussion'] },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), GhostIdentity.deleteMany(), Post.deleteMany(), Community.deleteMany(), Notification.deleteMany()]);
    console.log('🧹 Cleared existing data');

    // Create admin user
    const adminUser = await User.create({ email: 'admin@wispr.ghost', password: 'Admin@1234', isAdmin: true });

    // Create identities
    const identities = [];
    for (const data of identityData) {
      const user = await User.create({ email: `${data.alias.toLowerCase()}@wispr.ghost`, password: 'Ghost@1234' });
      const identity = await GhostIdentity.create({ owner: user._id, alias: data.alias, avatar: { color: data.color, style: data.style }, bio: data.bio, reputation: data.reputation });
      user.identities.push(identity._id);
      user.activeIdentity = identity._id;
      await user.save();
      identities.push(identity);
    }

    // Admin identity
    const adminIdentity = await GhostIdentity.create({ owner: adminUser._id, alias: 'WisprAdmin', avatar: { color: '#00f5ff', style: 'cyber' }, bio: 'The architect of the void.', reputation: 9999 });
    adminUser.identities.push(adminIdentity._id);
    adminUser.activeIdentity = adminIdentity._id;
    await adminUser.save();

    // Create communities
    const communities = [];
    for (let i = 0; i < communityData.length; i++) {
      const community = await Community.create({ ...communityData[i], creator: identities[i]._id, moderators: [identities[i]._id], members: identities.map(id => id._id), membersCount: identities.length, color: communityData[i].color });
      communities.push(community);
    }

    // Create posts
    for (let i = 0; i < postData.length; i++) {
      const author = identities[i % identities.length];
      const community = communities[i % communities.length];
      const upvoters = identities.filter((_, idx) => idx !== i % identities.length).slice(0, Math.floor(Math.random() * 4));
      await Post.create({ ...postData[i], author: author._id, community: community._id, upvotes: upvoters.map(u => u._id), trendingScore: upvoters.length * 3 + Math.random() * 100 });
    }

    // Follow relationships
    for (let i = 0; i < identities.length; i++) {
      const me = identities[i];
      const others = identities.filter((_, idx) => idx !== i).slice(0, 2);
      me.following = others.map(o => o._id);
      me.followingCount = others.length;
      await me.save();
      for (const other of others) {
        other.followers.push(me._id);
        other.followersCount += 1;
        await other.save();
      }
    }

    console.log('✅ Seed data created successfully!');
    console.log('📧 Admin: admin@wispr.ghost | Password: Admin@1234');
    console.log('📧 Test users: {alias}@wispr.ghost | Password: Ghost@1234');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
