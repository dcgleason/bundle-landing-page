import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faExclamationCircle, faCheck, faSave } from "@fortawesome/free-solid-svg-icons";
import useRecordingsList from "../../hooks/use-recordings-list";
import { useState } from "react";



export default function RecordingsList({ audio, setAudioRecorded, getData }) {
  const { recordings, deleteAudio } = useRecordingsList(audio);
  const [ saved, setSaved ] = useState(true)

  console.log('recordings are here ' + JSON.stringify(recordings) )


  return (
    <div className="flex flex-col">
      {recordings.length > 0 ? (
        <>
          {/* <h1 className="text-2xl">Your recording</h1> */}
          <div className="flex flex-col">
          
            {recordings.map((record) => (
            <div className="my-4 flex space-x-4" key={record.key}>
            <audio className="w-full" controls src={record.audio} playsinline />
           
            <div className="ml-auto flex">
              <button
                className="bg-red-500 text-white rounded-md p-2 mr-2"
                title="Delete this audio"
                onClick={(e) => {
                  e.preventDefault();
                  deleteAudio(record.key);
                  setAudioRecorded(false);
                  getData([{audio: ""}])
                  console.log('deletedRecording');
                  setSaved(true)
                }}
              >
                Delete
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
              {saved ? (
              <button
                className="bg-green-500 text-white rounded-md p-2"
                title="Add this audio"
                onClick={(e) => {
                  e.preventDefault();
                  getData(recordings);
                  setSaved(false)
                  console.log('adding audio');
              
                }}
              >
                Save
                <FontAwesomeIcon icon={faSave} />
              </button>
            ) : (
              <div></div> )
}
            </div> 
          </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-l">(Click on the red microphone to record your message)</span>
          <FontAwesomeIcon icon={faExclamationCircle} size="2x" color="#f2ea02" />
        </div>
      )}
    </div>
  );
}