import React from 'react';
import { CheckCircle, Circle, Clock, XCircle, User } from 'lucide-react';
import { ROLES } from '../config/roleConfig';

const WorkflowVisualization = ({ transaction }) => {
    const { workflowStages, currentStageIndex, status } = transaction;

    if (!workflowStages || workflowStages.length === 0) return null;

    return (
        <div className="mt-4 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Approval Workflow Progress</h4>
            <div className="relative flex items-center justify-between w-full">
                {/* Connecting Line */}
                <div className="absolute top-3 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

                {workflowStages.map((stage, index) => {
                    let stageStatus = 'PENDING';
                    if (index < currentStageIndex) stageStatus = 'COMPLETED';
                    if (index === currentStageIndex) {
                        stageStatus = status === 'REJECTED' ? 'REJECTED' : 'CURRENT';
                    }

                    // Determine icon and color
                    let Icon = Circle;
                    let colorClass = 'text-slate-300 bg-white border-slate-300';
                    let lineColor = 'bg-slate-200';

                    if (stageStatus === 'COMPLETED') {
                        Icon = CheckCircle;
                        colorClass = 'text-green-600 bg-white border-green-600';
                        lineColor = 'bg-green-600';
                    } else if (stageStatus === 'CURRENT') {
                        Icon = Clock;
                        colorClass = 'text-indigo-600 bg-white border-indigo-600';
                    } else if (stageStatus === 'REJECTED') {
                        Icon = XCircle;
                        colorClass = 'text-red-600 bg-white border-red-600';
                    }

                    // Get role names for tooltip
                    const roleNames = stage.roles.map(r => ROLES[r]?.name || r).join(', ');

                    return (
                        <div key={index} className="flex flex-col items-center relative group">
                            {/* Progress Line Segment (colored if completed) */}
                            {index > 0 && (
                                <div
                                    className={`absolute top-3 right-[50%] w-[200%] h-0.5 -z-20 ${index <= currentStageIndex ? 'bg-indigo-600' : 'bg-slate-200'
                                        }`}
                                    style={{ right: '50%', width: '100vw' }} // Hack to fill space, parent overflow hidden needed? No, just rely on absolute positioning relative to flex items
                                ></div>
                            )}

                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${colorClass}`}>
                                <Icon size={14} />
                            </div>

                            <div className="mt-2 text-center">
                                <div className={`text-xs font-bold ${stageStatus === 'CURRENT' ? 'text-indigo-700' : 'text-slate-600'}`}>
                                    {stage.stage.replace('_', ' ')}
                                </div>
                                <div className="text-[10px] text-slate-400 max-w-[80px] truncate" title={roleNames}>
                                    {roleNames}
                                </div>
                            </div>

                            {/* Approval Details Tooltip/Popover */}
                            {stage.approvals && stage.approvals.length > 0 && (
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg w-48 z-50">
                                    {stage.approvals.map((approval, i) => (
                                        <div key={i} className="mb-1 last:mb-0 border-b border-slate-700 last:border-0 pb-1 last:pb-0">
                                            <div className="font-bold flex items-center gap-1">
                                                <User size={10} /> {approval.userId.split('@')[0]}
                                            </div>
                                            <div className="italic opacity-80">"{approval.comments}"</div>
                                            <div className="text-[9px] opacity-60">{new Date(approval.timestamp).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkflowVisualization;
