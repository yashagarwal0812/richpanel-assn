const axios = require('axios');
const User = require('../models/User');
const FacebookConnection = require('../models/FacebookConnection')

async function getImgUrl(pageId, pageAccessToken) {
    const imgUrl = await axios.get(`https://graph.facebook.com/v23.0/${pageId}/picture?type=large&redirect=false&access_token=${pageAccessToken}`);
    return imgUrl.data.data.url;
}

exports.connectPage = async (req, res) => {
  const { pageAccessToken, pageId, pageName, imgUrl } = req.body;

  try {
    // const { data } = await axios.get(`https://graph.facebook.com/v17.0/me?access_token=${pageAccessToken}`);
    // const pageId = data.id;
    // const pageName = data.name;

    // const imgUrl = await getImgUrl(pageId, pageAccessToken);

    // const existing = await FBConnection.findOneAndUpdate(
    //   { userId: req.user._id, pageId },
    //   { pageAccessToken, pageName },
    //   { upsert: true, new: true }
    // );

    await axios.post(`https://graph.facebook.com/v17.0/${pageId}/subscribed_apps`, null, {
      params: {
        access_token: pageAccessToken,
        subscribed_fields: 'messages,messaging_postbacks,message_reads,message_deliveries'
      }
    });

    const user = await User.findById(req.user.id);
    user.fbPage = { connected: true,  accessToken: pageAccessToken, pageId: pageId};
    await user.save();

    const pageLink = await FacebookConnection.findOneAndUpdate(
        {userId: req.user.id},
        {pageId: pageId, pageName: pageName, pageAccessToken: pageAccessToken, pageProfilePictureUrl: imgUrl, connectedAt: Date.now()},
        {new: true, upsert: true }
    )
    await pageLink.save();

    res.json({ success: true, pageId, pageName, url: imgUrl });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ error: 'Failed to connect page' });
  }
};

exports.disconnectPage = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.fbPage = { connected: false };
  await user.save();
  const deletedPage = await FacebookConnection.findOneAndDelete({ userId: req.user.id });
  res.json({ msg: 'Page disconnected' });
};

exports.getList = async (req, res) => {
    try {
        const { appId, appSecret, userAccessToken } = req.body;

        let response = await axios.get(`https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${userAccessToken}`);
        let longUserAccessToken = response.data.access_token; // Facebook returns data in a `.data.data` structure

        response = await axios.get(`https://graph.facebook.com/v23.0/me/accounts?access_token=${longUserAccessToken}`);
        pages = response.data.data; // Facebook returns data in a `.data.data` structure

        const list = await Promise.all(
            pages.map(async (page) => {
                const imgUrl = await getImgUrl(page.id, page.access_token);
                return {
                name: page.name,
                accessToken: page.access_token,
                id: page.id,
                url: imgUrl
                };
            })
        );

        res.json({ accessToken: longUserAccessToken, data: list });

    } catch (error) {
        console.error('Error fetching pages:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch pages.' });
    }
};

exports.getInfo = async (req, res) => {
    try{
        console.log(req.user.id);
        const user = await User.findById(req.user.id);
        const isConnected = user.fbPage.connected;
        if(!isConnected) res.status(200).json({isConnected: false});
        const page = await FacebookConnection.findOne({
            userId: req.user.id,
            pageId: user.fbPage.pageId
        })
        console.log("Hello");
        if(!page) res.status(404).json({error: 'page not in database'});
        res.status(200).json({isConnected: true, name: page.pageName});
    }
    catch (error) {
        console.error('Error fetching info:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch pages.' });
    }

}
