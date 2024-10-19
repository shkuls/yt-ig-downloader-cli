#!/usr/bin/env node
import inquirer from "inquirer";
import youtubedl from 'youtube-dl-exec'
import ytdl from 'ytdl-core'
import { select, Separator } from '@inquirer/prompts';
import path from 'path'


const mediaType = async () =>{
    const type = await select({
        message: 'Select the Format',
        choices: [
          {
            name: 'Video',
            value: 'video',
          },
          {
            name: 'Audio Only',
            value: 'audioonly',
          },
          
        ],
      });
    return type
}

const chooseFormat = async (formats)=>{
    const format = await select({
        message: 'Select the Format \n Type - Qualtiy - Bitrate',
        choices: formats,
      });
    return format
}

const downloadYt = async (url) =>{
  
    const type = await mediaType()
    const info = await ytdl.getInfo(url);
    let formats = ytdl.filterFormats(info.formats, type === 'audioonly' ? 'audioonly' : 'video');
    const formatChoices = formats.map((format) => {
        return {
          name: `${format.container} - ${format.qualityLabel || 'Audio'} - ${format.bitrate || format.audioBitrate}kbps`,
          value: format,
        };
      });
      const chosenFormat = await chooseFormat(formatChoices)
        
  const title = info.videoDetails.title;
  const extension = chosenFormat.container || 'mp3';
  const outputPath = path.resolve(process.cwd(), `${title}.${extension}`);
      const extractAudio = type === 'audioonly' ? true : null
    await youtubedl(url, { format: chosenFormat , extractAudio : extractAudio})
    .then( console.log(`Downloading : ${title}`))
    console.log(`Downloaded to: ${outputPath}`)
};




const downloadIg = async (url) =>{
    const type = await mediaType()
}

const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be'))
        return 'youtube'
    else if (url.includes('instagram.com'))
        return 'instagram'
    else
        return null
}

const main = async () => {
    

    inquirer
        .prompt([{
            type: 'input',
            name: 'URL', // The key for storing the answer
            message: 'Please paste the URL', 
        }])
        .then(async (ans) => {
            const platform = detectPlatform(ans.URL);
            if(platform === 'youtube')
              downloadYt(ans.URL)
            else if(platform === 'instagram')
                downloadIg(url)
            else  
                console.log("Please enter a valid url")
        })
       
}
main()